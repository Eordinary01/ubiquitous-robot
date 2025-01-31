const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema({
    member:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    gum:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        required: true
    },
    status:{
        type: String,
        enum: ["pending","approved","rejected"],
        default: "pending"
    },
});

mongoose.model("Join", joinSchema);