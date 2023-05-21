const medicineModel = require("../../DB/Model/medicineModel");
const userModel = require("../../DB/Model/userModel");
const schedule = require("node-schedule"); 
const {io} = require("../../socket");
const {socketIdMap} =require("./addMedicine");


const addOneDay = (date) => {
  date = new Date(date);
  date.setDate(date.getDate() + 1);
  date.toUTCString();
  return date
}
// const addTwoMinutes = (date) => {
//   date = new Date(date);
//   date.setMinutes(date.getMinutes() + 1);
//   date.toUTCString();
//   return date;
// };

const updateMedicine = async (req, res) => {
  try {
    const { name, dosage, time ,duration} = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    const medicine = await medicineModel.findById(id);
    const user = await userModel.findById(userId);
    
    // Cancel the existing job using the job ID stored in the document
    schedule.cancelJob(medicine.jobId);

    // Update the medicine timing
    medicine.name = name;
    medicine.dosage = dosage;
    medicine.time = time;
    medicine.duration=duration;
    
    const currentTime = new Date();
    const enterTime = new Date(time);

    if (enterTime <= currentTime) {
      return res.json({ message: "Please enter a time in the future" });
    }

    await medicine.save();
    user.medicineTimings.push(medicine);
    await user.save();
    
    let targetTime = medicine.time;
    const addTask = async () => {
      console.log("previous date: ", targetTime);
      
       // Emit a custom event to the specific user's socket ID
       const userSocketId = socketIdMap[userId];
       console.log(userSocketId);
       if (userSocketId) {
         io.to(userSocketId).emit("medicineTimingNotification", {
           message: `It's time to take ${dosage} of ${name}`,
         });
       }
      
      let medicineDuration = medicine.duration ;
       medicine.duration = --medicineDuration
      if (medicineDuration >= 0) {
        // add one day to the TargetTime and set the targetTime variable to the updatedTargetTiem
        const updatedTargetTime = addOneDay(targetTime).toUTCString();
        targetTime = updatedTargetTime
        medicine.time = updatedTargetTime
        //adding new Task
        const newJob = schedule.scheduleJob(medicine._id.toString(), targetTime,addTask);
        
        // decrease duration by one and save to database 
       
        await medicine.save()
    
      }
      else{
        medicine.duration = 0 ;
        await medicine.save();
      }
   
      console.log("next date: ", targetTime);
    }
    // Schedule a job to send a notification to the user at the specified time every day
    const newJob = schedule.scheduleJob(medicine._id.toString(), targetTime,addTask);


  
    console.log(newJob);
    medicine.jobId = newJob.name; // Update the jobId property of the medicine document

    await medicine.save();
    res.json({message :"medicine updated",medicine});
  } catch (err) {
    res.json({ message: "update error", ...err });
  }
};

module.exports = updateMedicine;
