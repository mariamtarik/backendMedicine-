
const connectDB = require("./DB/connect");
const {app,io,express,server} = require('./socket')
var cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const port = process.env.PORT;
connectDB();
//Auth Router
const authRouter = require("./Routes/AuthRouter");
app.use("/api/auth/", authRouter);
//Medicine Router
const medicineRouter = require("./Routes/MedicineRouter");
const userModel = require("./DB/Model/userModel");
app.use("/api/medicine/", medicineRouter);

app.use("/", (req, res) => {
  res.send("hello");
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
// module.exports = socketIdMap

