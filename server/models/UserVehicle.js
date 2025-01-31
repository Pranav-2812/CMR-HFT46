const mongoose = require("mongoose");
const UserVehicleSchema = new mongoose.Schema({
    userId: {
        type :mongoose.Schema.Types.ObjectId,
        ref :"user"
    },
    vehicle_number:{
        type:String,
        reqiured:true,
        unique:true
    },
    vehicle_type:{
        type:String,
        reqiured:true
    }
})
const UserVehicle = mongoose.model("UserVehicle",UserVehicleSchema);
module.exports = UserVehicle;