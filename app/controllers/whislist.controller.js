const WhislistController = {};
const { DateNow, fromNow } = require("../helpers/utils");
const parseResponse = require("../helpers/parse-response");
const WhislistModel = require("../models/whislist.model");
const { options } = require("../routes/auth");
const log = "Whislist controller";

WhislistController.addWhislist = async (req, res, next) => {
  console.log("Add whislist");
  let data = {};
  try {
    // validate data input
    let { body } = req;
    // let valid = await AuthController.validate(body);
    let valid = "2";
    if (valid === "3") {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Data is not Valid"));
    } else {
      // set data
      let whislistData = [
        { key: "id_rig", value: body["id_rig"] },
        { key: "id_material", value: body["id_material"] },
        { key: "keterangan", value: body["keterangan"] },
        { key: "created_by", value: body["created_by"] },
      ];
      // save data
      let insertSuccess = await WhislistModel.save(whislistData);
      // check if suucess save
      if (!insertSuccess) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Failed to save in Database"));
      } else {
        res
          .status(200)
          .send(parseResponse(true, data, "00", "Success create whislist"));
      }
    }
  } catch (error) {}
};

WhislistController.getwhislistbyidrig = async (req, res, next) => {
  console.log("Get Whislist");
  try {
    let { id_rig } = req.query;
    let data = await WhislistModel.QueryCustom(
      "SELECT " +
        " tb_header_whislist.id_rig," +
        " tb_header_whislist.id_material," +
        " tb_header_whislist.created_by," +
        " rigName," +
        " material_description," +
        " keterangan" +
        " FROM tb_header_whislist" +
        " INNER JOIN tb_master_rig ON tb_header_whislist.id_rig = tb_master_rig.rigId" +
        " INNER JOIN tb_master_material ON tb_header_whislist.id_material = tb_master_material.ID" +
        " WHERE tb_header_whislist.id_rig = '" +
        id_rig +
        "'"
    );

    res
      .status(200)
      .send(
        parseResponse(
          true,
          data,
          "00",
          "Get Whislist" + "whislist" + " Success"
        )
      );
  } catch (error) {}
};

module.exports = WhislistController;
