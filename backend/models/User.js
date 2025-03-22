const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    role:
    {
        type: String,
        enum: ["member", "admin","gymOwner"],
        required: true,
        default: "user"
    },
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        default: null 
    }


},
{ timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);