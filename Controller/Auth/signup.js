const userModel = require("../../DB/Model/userModel");

const signUp=async(req,res)=>{
const{name,email,password}=req.body;
try {
    let user=await userModel.findOne({email});
    if(user){
        res.json({message:"email is already registerd"})
    }
    else{
        const newUser=new userModel({name,email,password});
        const savedUser= await newUser.save()
        res.json({message:"registerd success",savedUser})
    }

} catch (err) {
    res.json({message:"failed registerd",...err})
}


}
module.exports=signUp