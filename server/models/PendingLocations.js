const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");
const PendingLocationsSchema = new mongoose.Schema({

    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    lat1:{
        type:Decimal128,
        required:true
    },
    long1:{
        type:Decimal128,
        required:true
    },
    lat2:{
        type:Decimal128,
        
    },
    long2:{
        type:Decimal128,
        
    },
    lat3:{
        type:Decimal128,
       
    },
    long3:{
        type:Decimal128,
        
    },
    lat4:{
        type:Decimal128,
       
    },
    long4:{
        type:Decimal128,
        
    },
    img1:{
        type:String,
        required:true
    },
    img2:{
        type:String,
        required:true
    }

}) 
const pendingLocations = mongoose.model("pendingLocations", PendingLocationsSchema);
module.exports = pendingLocations;