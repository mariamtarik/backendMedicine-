
const medicineModel = require("../../DB/Model/medicineModel");
const userModel = require("../../DB/Model/userModel");
const { io } = require("../../socket");
const socketIO = require("socket.io");
const schedule = require("node-schedule");
const socketIdMap = {}; // Map to store user socket IDs

io.on("connection", (socket) => {
  console.log("User connected");
  // Handle user connection
  socket.on("userConnected", async(userId) => {
    console.log(userId);
    console.log(socket.id)
    socketIdMap[userId] = socket.id;
    const user = await userModel.findById(userId);
    console.log(user);
    if (user) {
     user.socketId = socket.id;
      await user.save();
    }
  });

  // Handle user disconnection
  socket.on("disconnect",async() => {
    // Find the user ID corresponding to the socket ID and remove it from the map and database
    const userId = Object.keys(socketIdMap).find(
      (key) => socketIdMap[key] === socket.id
    );
    if (userId) {
      delete socketIdMap[userId];
      const user = await userModel.findById(userId);
      if (user) {
        user.socketId = null;
       await user.save();
      }
    }
  });
});


const addOneDay = (date) => {
  date = new Date(date);
  date.setDate(date.getDate() + 1);
  date.toUTCString();
  return date;
};

const addNewMedicine = async (req, res) => {
  try {
    const { name, dosage, time, duration } = req.body; // Add 'duration' field to specify the number of days
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    const medicine = new medicineModel({
      name,
      dosage,
      time,
      duration,
      user: userId,
    });
    const currentTime = new Date();
    const enterTime = new Date(time);

    if (enterTime <= currentTime) {
      return res.json({ message: "Please enter a time in the future" });
    }
    
    
    // Save the duration in the medicine model
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

      let medicineDuration = medicine.duration;
      medicine.duration = --medicineDuration;
      if (medicineDuration > 0) {
        // add one day to the TargetTime and set the targetTime variable to the updatedTargetTiem
        const updatedTargetTime = addOneDay(targetTime).toUTCString();
        targetTime = updatedTargetTime;
        medicine.time = updatedTargetTime;
        //adding new Task
        const job = schedule.scheduleJob(
          medicine._id.toString(),
          targetTime,
          addTask
        );

        // decrease duration by one and save to database
        await medicine.save();
      } else {
        medicine.duration = 0;
        await medicine.save();
      }

      console.log("next date: ", targetTime);
    };

    // Schedule a job to send a notification to the user at the specified time every day
    const job = schedule.scheduleJob(
      medicine._id.toString(),
      targetTime,
      addTask
    );

    // Store the job ID in the medicine timing document
    medicine.jobId = job.name;
    await medicine.save();

    res.json({ message: "medicine added", medicine });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

module.exports = {addNewMedicine ,socketIdMap}

// https://medicinetimingbeckend.onrender.com