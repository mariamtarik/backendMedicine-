const medicineModel = require("../../DB/Model/medicineModel");
const userModel = require("../../DB/Model/userModel");
const schedule = require("node-schedule"); 

const deleteMedicine = async (req, res) => {
    // let { id } = req.params;
    try {
    const  userId = req.user._id;
    let { id } = req.params;

      const medicine = await medicineModel.findById(id);
    
      // Cancel the job using the job ID stored in the medicine timing document
      schedule.cancelJob(medicine.jobId);
    
      // Remove the medicine timing from the user's medicine timings array
      const user = await userModel.findById(userId);
      user.medicineTimings.pull(id);
      await user.save();
    
      // Delete the medicine timing document
       const medicinedeleted = await medicineModel.deleteOne({ _id: id });
      res.json({ message: "deleted sucess", medicinedeleted });
    
      // res.json({ message: 'Medicine timing deleted' });
      // const medicine = await medicineModel.deleteOne({ _id: id });
      // res.json({ message: "deleted sucess", medicine });
    } catch (errors) {
      res.json({ message: "deleted error", ...errors });
    }
  };
  module.exports=deleteMedicine