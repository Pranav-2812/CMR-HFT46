const mongoose = require("mongoose");

const url = process.env.VITE_PARKING_CONN_STR
const connectToMongo = ()=>{
    mongoose.connect(url, {
        tls: true,
        tlsInsecure: true,
        
      });
}
module.exports = connectToMongo;