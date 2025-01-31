const mongoose = require("mongoose");
const carSlotSchema = new mongoose.Schema({
    slot_no:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
})
const carSlot = mongoose.model("carSlot",carSlotSchema);
module.exports = carSlot