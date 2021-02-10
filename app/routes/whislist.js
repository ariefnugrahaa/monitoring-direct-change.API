const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/auth.middleware");
const WhislistController = require("../controllers/whislist.controller");

router.post("/addselectedwhislist", WhislistController.addselectedwhislist);
router.post("/addwhislist", WhislistController.addWhislist);
router.get("/getwhislistbyidrig", WhislistController.getwhislistbyidrig);
router.post("/deletewhislist", WhislistController.deletewhislist);
router.post(
    "/deleteselectedwhislist",
    WhislistController.deleteselectedwhislist
  );

// router.get("/materiallist", MaterialListController.getMaterialListByRigId);
//   .all("/*", authentication)

module.exports = router;
