const {addNewMedicine} = require("../Controller/Medicine/addMedicine");
const allMdicines = require("../Controller/Medicine/allMedicine");
const deleteMedicine = require("../Controller/Medicine/deleteMedicine");
const updateMedicine = require("../Controller/Medicine/updateMedicine");
const router = require("express").Router();
const  auth  = require("../middleWare/auth");
router.get("/allMedicine", auth(["user"]) ,allMdicines);
router.post("/addMedicine", auth(["user"]), addNewMedicine);
router.put(
  "/updateMedicine/:id",
  auth(["user"]),
  updateMedicine
);
router.delete(
  "/deleteMedicine/:id",
  auth(["user"]),
  deleteMedicine
);

module.exports = router;