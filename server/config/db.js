const mongoose = require("mongoose");
const connectDB = async ()=>{
    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect('mongodb+srv://MAGi:pNeDMUqjnRWoVoNH@nodejs-blogdb.igbucbc.mongodb.net/');
        console.log(`Database Connected: ${conn.connection.host}`);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectDB;
