const DashboardController = {};
const { DateNow, fromNow } = require("../helpers/utils");
const parseResponse = require("../helpers/parse-response");
const DashboardModel = require("../models/materiallist.model");
const { options } = require("../routes/auth");
const log = "Whislist controller";

DashboardController.getamountmaterial = async (req, res, next) => {
  console.log("Get Amount Material");
  try {
    let data = await DashboardModel.QueryCustom(
      "SELECT " +
        " tb_master_rig.rigName," +
        " COUNT(tb_master_material.id_rig) AS Jumlah" +
        " FROM tb_master_material" +
        " INNER JOIN tb_master_rig ON tb_master_material.id_rig = tb_master_rig.rigId" +
        " GROUP BY tb_master_rig.rigName"
    );
    res
      .status(200)
      .send(
        parseResponse(true, data, "00", "Get Amount Material" + " Success")
      );
  } catch (error) {}
};

DashboardController.getsumamountmaterial = async (req, res, next) => {
  console.log("Get Sum Amount Material");
  try {
    let data = await DashboardModel.QueryCustom(
      "SELECT " +
        " tb_master_rig.rigName," +
        " tb_master_material.qty * tb_master_material.value AS Jumlah" +
        " FROM tb_master_material" +
        " INNER JOIN tb_master_rig ON tb_master_material.id_rig = tb_master_rig.rigId" +
        " GROUP BY tb_master_rig.rigName"
    );
    res
      .status(200)
      .send(
        parseResponse(true, data, "00", "Get Amount Material" + " Success")
      );
  } catch (error) {}
};

module.exports = DashboardController;
