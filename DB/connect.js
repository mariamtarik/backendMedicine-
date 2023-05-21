const mongoose=require("mongoose");

const connectDB=()=>{

    return mongoose.connect(process.env.DB_URL).then((res)=>{
        console.log("DB connected...")
            }).catch((err)=>{console.log("failed connected",err)})
        } 



module.exports=connectDB;