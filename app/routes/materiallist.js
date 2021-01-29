const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/auth.middleware");
const MaterialListController = require("../controllers/materiallist.controller");

router.get(
  "/getmateriallistdetail",
  MaterialListController.getmateriallistdetail
);
router.get(
  "/getmateriallistrig",
  MaterialListController.getmateriallistbyrigid
);
router.get("/getallmateriallist", MaterialListController.getallmateriallist);
router.post("/addmateriallist", MaterialListController.addmateriallist);
router.post("/editmateriallist", MaterialListController.editmateriallist);
router.post("/deletemateriallist", MaterialListController.deletemateriallist);
router.post(
  "/deleteselectedmateriallist",
  MaterialListController.deleteselectedmateriallist
);

// router.get("/materiallist", MaterialListController.getMaterialListByRigId);
//   .all("/*", authentication)

module.exports = router;
