const mongoose = require("mongoose");
const citySchema = new mongoose.Schema({
    name:{
        type:String,
        reuired:true
    },
    locations:{
        type:Number,
        required:true,
        default:0
    }
})
const cities = mongoose.model("cities",citySchema);
module.exports = cities