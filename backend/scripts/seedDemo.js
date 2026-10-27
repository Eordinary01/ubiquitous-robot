const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Gym = require("../models/GymSchema");
const Join = require("../models/joinSchema");
const Member = require("../models/Member");

const DEMO_EMAILS = [
  "demo@gym.com",
  "rahul@demo.com",
  "dummy1@demo.com",
  "dummy2@demo.com",
  "dummy3@demo.com",
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  return {
    reset: args.includes("--reset"),
    forceProd: args.includes("--force-prod"),
  };
};

const extractHost = (uri) => {
  if (!uri) return "unknown";
  try {
    const atParts = uri.split("@");
    if (atParts.length > 1) {
      return atParts[1].split("/")[0].split("?")[0];
    }
    return uri.split("//")[1]?.split("/")[0] || "unknown";
  } catch {
    return "unknown";
  }
};

const seedDemo = async () => {
  const { reset, forceProd } = parseArgs();
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI is not set in environment.");
    process.exit(1);
  }

  const dbHost = extractHost(mongoUri);
  console.log(`\n==============================================`);
  console.log(`Target Database Host: ${dbHost}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`==============================================\n`);

  if (process.env.NODE_ENV === "production" && !forceProd) {
    console.error("❌ Refusing to run demo seed against PRODUCTION without --force-prod flag.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB successfully.");

  try {
    if (reset) {
      console.log("🧹 --reset specified: Purging previous demo records...");
      const existingDemoUsers = await User.find({ email: { $in: DEMO_EMAILS } });
      const demoUserIds = existingDemoUsers.map((u) => u._id);

      const existingDemoGyms = await Gym.find({ owner: { $in: demoUserIds } });
      const demoGymIds = existingDemoGyms.map((g) => g._id);

      const deletedMembers = await Member.deleteMany({
        $or: [{ user: { $in: demoUserIds } }, { gym: { $in: demoGymIds } }],
      });
      console.log(`- Deleted ${deletedMembers.deletedCount} demo Member documents.`);

      const deletedJoins = await Join.deleteMany({
        $or: [{ member: { $in: demoUserIds } }, { gym: { $in: demoGymIds } }],
      });
      console.log(`- Deleted ${deletedJoins.deletedCount} demo Join requests.`);

      const deletedGyms = await Gym.deleteMany({ owner: { $in: demoUserIds } });
      console.log(`- Deleted ${deletedGyms.deletedCount} demo Gyms.`);

      const deletedUsers = await User.deleteMany({ email: { $in: DEMO_EMAILS } });
      console.log(`- Deleted ${deletedUsers.deletedCount} demo Users.`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 1. Upsert Demo Owner
    let demoOwner = await User.findOne({ email: "demo@gym.com" });
    if (!demoOwner) {
      demoOwner = new User({
        name: "Demo Gym Owner",
        email: "demo@gym.com",
        password: hashedPassword,
        role: "gymOwner",
      });
      await demoOwner.save();
      console.log("✅ Created Demo Owner (demo@gym.com)");
    } else {
      demoOwner.name = "Demo Gym Owner";
      demoOwner.password = hashedPassword;
      demoOwner.role = "gymOwner";
      await demoOwner.save();
      console.log("ℹ️ Updated Demo Owner (demo@gym.com)");
    }

    // 2. Upsert Demo Gym
    let demoGym = await Gym.findOne({ owner: demoOwner._id });
    const gymData = {
      name: "Iron Paradise Gym",
      owner: demoOwner._id,
      address: {
        street: "124 Muscle Beach Blvd",
        city: "Venice",
        state: "CA",
        zipCode: "90291",
      },
      contact: {
        phone: "555-019-2834",
        email: "contact@ironparadise.com",
      },
      amenities: [
        "Cardio Equipment",
        "Weight Training",
        "Group Classes",
        "Sauna",
        "Locker Rooms",
        "Personal Training",
      ],
      operatingHours: {
        openTime: "06:00 AM",
        closeTime: "11:00 PM",
        daysOpen: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      memberShipPlans: [
        { name: "Monthly Standard", price: 50, duration: "Monthly" },
        { name: "Quarterly Pro", price: 135, duration: "Quarterly" },
        { name: "Annual VIP", price: 480, duration: "Annual" },
      ],
      isActive: true,
      gymLogo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop",
      themeColor: "#4F46E5",
    };

    if (!demoGym) {
      demoGym = await Gym.create(gymData);
      console.log("✅ Created Iron Paradise Gym with branding (#4F46E5)");
    } else {
      Object.assign(demoGym, gymData);
      await demoGym.save();
      console.log("ℹ️ Updated Iron Paradise Gym branding and plans");
    }

    demoOwner.gymId = demoGym._id;
    await demoOwner.save();

    // 3. Upsert Active Member: Rahul Sharma
    let rahul = await User.findOne({ email: "rahul@demo.com" });
    if (!rahul) {
      rahul = new User({
        name: "Rahul Sharma",
        email: "rahul@demo.com",
        password: hashedPassword,
        role: "member",
        gymId: demoGym._id,
      });
      await rahul.save();
      console.log("✅ Created Member Rahul Sharma (rahul@demo.com)");
    } else {
      rahul.name = "Rahul Sharma";
      rahul.password = hashedPassword;
      rahul.role = "member";
      rahul.gymId = demoGym._id;
      await rahul.save();
      console.log("ℹ️ Updated Member Rahul Sharma");
    }

    // Join Request for Rahul
    let rahulJoin = await Join.findOne({ member: rahul._id, gym: demoGym._id });
    if (!rahulJoin) {
      rahulJoin = await Join.create({
        member: rahul._id,
        gym: demoGym._id,
        status: "approved",
      });
      console.log("✅ Created approved join record for Rahul");
    } else {
      rahulJoin.status = "approved";
      await rahulJoin.save();
    }

    // Active Member Record for Rahul
    const now = new Date();
    const oneMonthAhead = new Date(now);
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    const rahulMemberData = {
      joinRequestId: rahulJoin._id,
      user: rahul._id,
      gym: demoGym._id,
      memberShipPlan: {
        name: "Monthly Standard",
        duration: "Monthly",
        startDate: now,
        endDate: oneMonthAhead,
        price: 50,
      },
      status: "active",
      paymentStatus: "paid",
      healthInfo: {
        medicalConditions: ["None"],
        allergies: ["Peanuts"],
        bloodGroup: "O+",
      },
      measurements: {
        date: now,
        weight: 76,
        height: 178,
        chest: 102,
        waist: 82,
        hips: 98,
        biceps: 38,
        thighs: 58,
        bodyFatPercentage: 14.5,
        bmi: 24.0,
      },
      exercisePlan: {
        Monday: {
          exercises: [
            { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 80, duration: 0, restBetweenSets: 90, notes: "Warmup with 50kg" },
            { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 65, duration: 0, restBetweenSets: 60, notes: "Focus on upper chest contraction" },
            { name: "Dumbbell Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Control the eccentric stretch" },
            { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 15, duration: 0, restBetweenSets: 45, notes: "Peak squeeze at center" },
          ],
          notes: "Chest hypertrophy focus",
          duration: 60,
        },
        Tuesday: {
          exercises: [
            { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Full range of motion" },
            { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 3, reps: 12, weight: 60, duration: 0, restBetweenSets: 60, notes: "Drive elbows to ribs" },
            { name: "Barbell Rows", muscleGroup: "BACK", sets: 4, reps: 10, weight: 70, duration: 0, restBetweenSets: 90, notes: "Torso 45 degrees" },
            { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 120, duration: 0, restBetweenSets: 120, notes: "Maintain neutral spine" },
          ],
          notes: "Back width and posterior chain",
          duration: 65,
        },
        Wednesday: {
          exercises: [
            { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 4, reps: 8, weight: 45, duration: 0, restBetweenSets: 90, notes: "Strict form, lock core" },
            { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Lead with elbows" },
            { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 12, duration: 0, restBetweenSets: 45, notes: "Squeeze rear deltoids" },
            { name: "Shrugs", muscleGroup: "SHOULDERS", sets: 4, reps: 12, weight: 32, duration: 0, restBetweenSets: 60, notes: "2s hold at peak" },
          ],
          notes: "Shoulder boulder routine",
          duration: 55,
        },
        Thursday: {
          exercises: [
            { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 100, duration: 0, restBetweenSets: 120, notes: "Below parallel depth" },
            { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 180, duration: 0, restBetweenSets: 90, notes: "Feet shoulder-width" },
            { name: "Leg Curls", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 45, duration: 0, restBetweenSets: 60, notes: "Hamstring isolation" },
            { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 20, weight: 50, duration: 0, restBetweenSets: 45, notes: "Full stretch at bottom" },
          ],
          notes: "Leg day quad & hamstring builder",
          duration: 70,
        },
        Friday: {
          exercises: [
            { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Strict elbows at sides" },
            { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Brachialis emphasis" },
            { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 3, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Lower gently to forehead" },
            { name: "Rope Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 15, weight: 25, duration: 0, restBetweenSets: 45, notes: "Spread rope at bottom" },
          ],
          notes: "Arm superset finisher",
          duration: 50,
        },
        Saturday: {
          exercises: [
            { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Contract core tightly" },
            { name: "Leg Raises", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Avoid swinging" },
            { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 1, weight: 0, duration: 60, restBetweenSets: 60, notes: "60-second isometric hold" },
            { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 10, duration: 0, restBetweenSets: 45, notes: "10kg plate rotation" },
          ],
          notes: "Core and stability conditioning",
          duration: 40,
        },
      },
      dietPlan: [
        {
          day: "Monday",
          meals: [
            {
              type: "Breakfast",
              time: "08:00 AM",
              items: [
                { name: "Oatmeal with Almond Milk", quantity: "80g", calories: 310, proteins: 10, carbs: 54, fats: 6 },
                { name: "Boiled Eggs", quantity: "3 large", calories: 210, proteins: 18, carbs: 1, fats: 14 },
                { name: "Banana", quantity: "1 medium", calories: 105, proteins: 1, carbs: 27, fats: 0 },
              ],
            },
            {
              type: "Lunch",
              time: "01:00 PM",
              items: [
                { name: "Grilled Chicken Breast", quantity: "200g", calories: 330, proteins: 62, carbs: 0, fats: 7 },
                { name: "Steamed Brown Rice", quantity: "150g", calories: 170, proteins: 4, carbs: 36, fats: 1 },
                { name: "Broccoli and Asparagus", quantity: "100g", calories: 45, proteins: 3, carbs: 8, fats: 0 },
              ],
            },
            {
              type: "Snack",
              time: "05:00 PM",
              items: [
                { name: "Greek Yogurt", quantity: "200g", calories: 150, proteins: 20, carbs: 8, fats: 4 },
                { name: "Raw Almonds", quantity: "25g", calories: 145, proteins: 5, carbs: 5, fats: 12 },
              ],
            },
            {
              type: "Dinner",
              time: "08:30 PM",
              items: [
                { name: "Baked Salmon Fillet", quantity: "180g", calories: 370, proteins: 36, carbs: 0, fats: 24 },
                { name: "Mashed Sweet Potato", quantity: "150g", calories: 130, proteins: 2, carbs: 30, fats: 0 },
                { name: "Green Salad with Olive Oil", quantity: "1 bowl", calories: 95, proteins: 1, carbs: 4, fats: 9 },
              ],
            },
          ],
          totalCalories: 2060,
          totalProteins: 162,
          totalCarbs: 173,
          totalFats: 77,
        },
      ],
    };

    let rahulMember = await Member.findOne({ joinRequestId: rahulJoin._id });
    if (!rahulMember) {
      rahulMember = await Member.create(rahulMemberData);
      console.log("✅ Created Rahul's Member profile with workouts and diet");
    } else {
      Object.assign(rahulMember, rahulMemberData);
      await rahulMember.save();
      console.log("ℹ️ Updated Rahul's Member profile");
    }

    // 4. Create 3 Dummy Users with Pending Join Requests
    const dummyCandidates = [
      { name: "Alex Turner", email: "dummy1@demo.com" },
      { name: "Sarah Connor", email: "dummy2@demo.com" },
      { name: "David Miller", email: "dummy3@demo.com" },
    ];

    for (const d of dummyCandidates) {
      let dUser = await User.findOne({ email: d.email });
      if (!dUser) {
        dUser = await User.create({
          name: d.name,
          email: d.email,
          password: hashedPassword,
          role: "member",
          gymId: null,
        });
        console.log(`✅ Created pending candidate user: ${d.name} (${d.email})`);
      } else {
        dUser.name = d.name;
        dUser.password = hashedPassword;
        dUser.role = "member";
        await dUser.save();
      }

      let dJoin = await Join.findOne({ member: dUser._id, gym: demoGym._id });
      if (!dJoin) {
        dJoin = await Join.create({
          member: dUser._id,
          gym: demoGym._id,
          status: "pending",
        });
        console.log(`  -> Created pending join request for ${d.name} [ID: ${dJoin._id}]`);
      } else {
        dJoin.status = "pending";
        await dJoin.save();
        console.log(`  -> Reset pending join request for ${d.name} [ID: ${dJoin._id}]`);
      }
    }

    console.log(`\n🎉 Demo seed completed successfully!`);
    console.log(`Credentials:`);
    console.log(`- Owner: demo@gym.com / password123`);
    console.log(`- Active Member: rahul@demo.com / password123`);
    console.log(`- Pending Candidates: dummy1@demo.com, dummy2@demo.com, dummy3@demo.com (pass: password123)`);
  } catch (err) {
    console.error("❌ Error during demo seed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.\n");
  }
};

seedDemo();
