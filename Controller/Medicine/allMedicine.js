const medicineModel = require("../../DB/Model/medicineModel")


const allMdicines=async(req,res)=>{
try {
  const allMdicines= await medicineModel.find({user:req.user._id}) 
  res.json({message:"send Mediciens sucess",allMdicines})

} catch (error) {
    res.json({message:"catch error",error})
}


}
module.exports=allMdicines