const mongoose = require("mongoose");
const bikeSlotSchema = new mongoose.Schema({
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
const bikeSlot = mongoose.model("bikeSlot",bikeSlotSchema)
module.exports = bikeSlot;