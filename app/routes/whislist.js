const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/auth.middleware");
const WhislistController = require("../controllers/whislist.controller");

router.post("/addwhislist", WhislistController.addWhislist);
router.get("/getwhislistbyidrig", WhislistController.getwhislistbyidrig);

// router.get("/materiallist", MaterialListController.getMaterialListByRigId);
//   .all("/*", authentication)

module.exports = router;
