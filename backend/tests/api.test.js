const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../server");

const User = require("../models/User");
const Gym = require("../models/GymSchema");
const Join = require("../models/joinSchema");
const Member = require("../models/Member");

describe("Backend Pitch-Ready Safety & Feature Test Suite", () => {
  let server;
  let baseUrl;
  let ownerToken;
  let ownerUser;
  let ownerGym;

  let foreignOwnerToken;
  let foreignOwner;
  let foreignGym;

  let candidateUser;
  let pendingJoin;

  before(async () => {
    process.env.DISABLE_RATE_LIMIT = "true";

    // Wait for mongoose connection if not yet connected
    if (mongoose.connection.readyState === 1) {
      // already connected
    } else if (mongoose.connection.readyState === 2) {
      await mongoose.connection.asPromise();
    } else {
      await mongoose.connect(process.env.MONGO_URI);
    }

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    const timestamp = Date.now();

    // 1. Create Test Owner & Gym
    ownerUser = await User.create({
      name: `Test Owner ${timestamp}`,
      email: `testowner_${timestamp}@test.com`,
      password: "hashedpassword123",
      role: "gymOwner",
    });

    ownerGym = await Gym.create({
      name: `Test Gym ${timestamp}`,
      owner: ownerUser._id,
      address: { street: "123 St", city: "City", state: "ST", zipCode: "12345" },
      contact: { phone: "1234567890", email: `gym_${timestamp}@test.com` },
      amenities: ["Weight Training"],
      operatingHours: { openTime: "06:00", closeTime: "22:00", daysOpen: ["Monday"] },
      memberShipPlans: [{ name: "Standard Plan", price: 40, duration: "Monthly" }],
      isActive: true,
      gymLogo: null,
      themeColor: null,
    });

    ownerUser.gymId = ownerGym._id;
    await ownerUser.save();

    ownerToken = jwt.sign(
      { userId: ownerUser._id, name: ownerUser.name, email: ownerUser.email, role: ownerUser.role, gymId: ownerGym._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 2. Create Foreign Owner & Foreign Gym (for isolation tests)
    foreignOwner = await User.create({
      name: `Foreign Owner ${timestamp}`,
      email: `foreign_${timestamp}@test.com`,
      password: "hashedpassword123",
      role: "gymOwner",
    });

    foreignGym = await Gym.create({
      name: `Foreign Gym ${timestamp}`,
      owner: foreignOwner._id,
      address: { street: "456 Ave", city: "Other", state: "ST", zipCode: "54321" },
      contact: { phone: "9876543210", email: `foreign_${timestamp}@test.com` },
      amenities: ["Sauna"],
      operatingHours: { openTime: "07:00", closeTime: "21:00", daysOpen: ["Tuesday"] },
      memberShipPlans: [{ name: "Foreign Plan", price: 60, duration: "Monthly" }],
      isActive: true,
    });

    foreignOwner.gymId = foreignGym._id;
    await foreignOwner.save();

    foreignOwnerToken = jwt.sign(
      { userId: foreignOwner._id, name: foreignOwner.name, email: foreignOwner.email, role: foreignOwner.role, gymId: foreignGym._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 3. Create Candidate & Pending Join Request for Owner Gym
    candidateUser = await User.create({
      name: `Candidate ${timestamp}`,
      email: `candidate_${timestamp}@test.com`,
      password: "hashedpassword123",
      role: "member",
    });

    pendingJoin = await Join.create({
      member: candidateUser._id,
      gym: ownerGym._id,
      status: "pending",
    });
  });

  after(async () => {
    // Clean up created test data
    if (ownerUser) {
      await Member.deleteMany({ gym: { $in: [ownerGym._id, foreignGym?._id] } });
      await Join.deleteMany({ gym: { $in: [ownerGym._id, foreignGym?._id] } });
      await Gym.deleteMany({ _id: { $in: [ownerGym._id, foreignGym?._id] } });
      await User.deleteMany({ _id: { $in: [ownerUser._id, foreignOwner?._id, candidateUser?._id] } });
    }

    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  });

  // --- BRANDING TESTS ---
  describe("A & B: Gym Branding Endpoint & Validation", () => {
    it("should reject invalid themeColor (bad hex)", async () => {
      const res = await fetch(`${baseUrl}/gyms/${ownerGym._id}/branding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ themeColor: "not-a-color" }),
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.match(data.message, /themeColor/);
    });

    it("should reject insecure gymLogo (javascript: URL)", async () => {
      const res = await fetch(`${baseUrl}/gyms/${ownerGym._id}/branding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ gymLogo: "javascript:alert(1)" }),
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.match(data.message, /gymLogo/);
    });

    it("should reject non-owner trying to update gym branding (403)", async () => {
      const res = await fetch(`${baseUrl}/gyms/${ownerGym._id}/branding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${foreignOwnerToken}` },
        body: JSON.stringify({ themeColor: "#10B981" }),
      });
      assert.equal(res.status, 403);
    });

    it("should successfully update branding with valid https URL and hex color", async () => {
      const res = await fetch(`${baseUrl}/gyms/${ownerGym._id}/branding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({
          gymLogo: "https://example.com/logo.png",
          themeColor: "#4F46E5",
        }),
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, "success");
      assert.equal(data.data.gym.themeColor, "#4F46E5");
      assert.equal(data.data.gym.gymLogo, "https://example.com/logo.png");
    });

    it("should allow clearing branding by setting null", async () => {
      const res = await fetch(`${baseUrl}/gyms/${ownerGym._id}/branding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ gymLogo: null, themeColor: null }),
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.data.gym.gymLogo, null);
      assert.equal(data.data.gym.themeColor, null);
    });
  });

  // --- QUICK APPROVE TESTS ---
  describe("D: Quick Approve Endpoint", () => {
    it("should reject quick-approve if caller does not own the gym (403)", async () => {
      const res = await fetch(`${baseUrl}/join/quick-approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${foreignOwnerToken}` },
        body: JSON.stringify({ joinRequestId: pendingJoin._id.toString() }),
      });
      assert.equal(res.status, 403);
    });

    it("should reject quick-approve for non-existent request (404)", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await fetch(`${baseUrl}/join/quick-approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ joinRequestId: fakeId.toString() }),
      });
      assert.equal(res.status, 404);
    });

    it("should successfully quick-approve pending request and create Member", async () => {
      const res = await fetch(`${baseUrl}/join/quick-approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ joinRequestId: pendingJoin._id.toString() }),
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.join.status, "approved");
      assert.ok(data.member);
      assert.equal(data.member.status, "active");
      assert.equal(data.member.paymentStatus, "pending");
      assert.equal(data.member.memberShipPlan.name, "Standard Plan");

      // Verify User was assigned gymId
      const updatedUser = await User.findById(candidateUser._id);
      assert.equal(updatedUser.gymId.toString(), ownerGym._id.toString());
    });

    it("should return 409 Conflict on duplicate quick-approve call", async () => {
      const res = await fetch(`${baseUrl}/join/quick-approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ joinRequestId: pendingJoin._id.toString() }),
      });
      assert.equal(res.status, 409);
    });
  });

  // --- CROSS-GYM DATA ISOLATION TESTS ---
  describe("F & G: Cross-Gym Data Isolation", () => {
    it("should return 403 when gym owner tries to query another gym's members", async () => {
      const res = await fetch(`${baseUrl}/members/gym-members?gymId=${foreignGym._id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${ownerToken}` },
      });
      assert.equal(res.status, 403);
    });

    it("should return 403 when non-owner tries to process another gym's join request", async () => {
      const foreignJoin = await Join.create({
        member: candidateUser._id,
        gym: foreignGym._id,
        status: "pending",
      });

      const res = await fetch(`${baseUrl}/join/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ requestId: foreignJoin._id.toString(), status: "approved" }),
      });
      assert.equal(res.status, 403);

      await Join.findByIdAndDelete(foreignJoin._id);
    });
  });
});
