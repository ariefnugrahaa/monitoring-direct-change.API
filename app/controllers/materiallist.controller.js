const MaterialListController = {};
const { DateNow, fromNow } = require("../helpers/utils");
const parseResponse = require("../helpers/parse-response");
const MaterialListModel = require("../models/materiallist.model");
const { options } = require("../routes/auth");
const log = "Material List controller";

MaterialListController.getmateriallistbyrigid = async (req, res, next) => {
  about = "Material List";
  console.log(`├── ${log} :: Get List ` + about);

  try {
    let { idrig } = req.query;
    let data = await MaterialListModel.QueryCustom(
      "SELECT ID, rigName, id_rig, sloc, sloc_description, material_description, category, part_number, manufacture, qty, nett_price, uom, qty * nett_price AS jumlah, updated_by " +
        " FROM tb_master_material" +
        " INNER JOIN tb_master_rig ON tb_master_material.id_rig = tb_master_rig.rigId" +
        " WHERE rigId = '" +
        idrig +
        "'"
    );
    res
      .status(200)
      .send(
        parseResponse(
          true,
          data,
          "00",
          "Get Material List " + about + " Success"
        )
      );
  } catch (error) {}
};

MaterialListController.getmateriallistdetail = async (req, res, next) => {
  about = "Get Material List By Id";
  console.log(`├── ${log} :: Get List ` + about);

  try {
    let { ID } = req.query;
    let data = await MaterialListModel.QueryCustom(
      "SELECT * FROM tb_master_material WHERE ID = '" + ID + "'"
    );
    res
      .status(200)
      .send(
        parseResponse(
          true,
          data,
          "00",
          "Get Material List By Id" + about + " Success"
        )
      );
  } catch (error) {}
};

MaterialListController.getallmateriallist = async (req, res, next) => {
  about = "Get All  Material List";
  try {
    data = await MaterialListModel.QueryCustom(
      "SELECT ID, id_rig, tb_master_rig.rigName AS rig_name, sloc, sloc_description, material_description, category, " +
        " part_number, manufacture, qty, nett_price, uom, qty * nett_price AS jumlah" +
        " FROM tb_master_material" +
        " INNER JOIN tb_master_rig ON tb_master_material.id_rig = tb_master_rig.rigId" +
        " WHERE qty NOT IN (0)"
    );
    res
      .status(200)
      .send(
        parseResponse(
          true,
          data,
          "00",
          "Get All Material List " + about + " Success"
        )
      );
  } catch (error) {}
};

MaterialListController.addmateriallist = async (req, res, next) => {
  let data = {};
  try {
    // validate data input
    let { body } = req;
    // let valid = await AuthController.validate(body);
    let valid = "2";
    let isUsed = await MaterialListController.checkUsageMaterial(
      body["material_description"],
      body["part_number"],
      body["manufacture"],
      body["id_rig"]
    );
    if (isUsed) {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Data tidak bisa dibuat"));
    } else {
      // set data
      let materialData = [
        { key: "id_rig", value: body["id_rig"] },
        { key: "sloc", value: body["sloc"] },
        { key: "sloc_description", value: body["sloc_description"] },
        { key: "material_description", value: body["material_description"] },
        { key: "category", value: body["category"] },
        { key: "part_number", value: body["part_number"] },
        { key: "manufacture", value: body["manufacture"] },
        { key: "qty", value: body["qty"] },
        { key: "uom", value: body["uom"] },
        { key: "nett_price", value: body["nett_price"] },
      ];
      // save data
      let insertSuccess = await MaterialListModel.save(materialData);
      // check if suucess save
      if (!insertSuccess) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Failed to save in Database"));
      } else {
        res
          .status(200)
          .send(parseResponse(true, data, "00", "Success add materiallist"));
      }
    }
  } catch (error) {}
};

MaterialListController.addmateriallistarr = async (req, res, next) => {
  let data = {};
  try {
    let { body } = req;
    console.log(body);
    let tempObject = [];
    for (let i = 0; i < body.length; i++) {
      tempObject.push(Object.values(body[i]));
    }
    let isUsed = false;
    if (isUsed) {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Data tidak bisa dibuat"));
    } else {
      let materialData = tempObject;
      let query =
        "INSERT INTO tb_master_material (sloc, sloc_description, material_description, category, part_number, manufacture, qty, uom, nett_price, id_rig) VALUES ?";
      let insertSuccess = await MaterialListModel.QueryCustom(query, [
        materialData,
      ]);
      if (!insertSuccess) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Failed to save in Database"));
      } else {
        res
          .status(200)
          .send(parseResponse(true, data, "00", "Success add materiallist"));
      }
    }
  } catch (error) {}
};

MaterialListController.checkUsageMaterial = async (
  materialdescription,
  partnumber,
  manufacture,
  id_rig
) => {
  console.log("check material used or not......");
  let status = "";
  let where = [
    { key: "id_rig", value: id_rig },
    { key: "material_description", value: materialdescription },
    { key: "part_number", value: partnumber },
    { key: "manufacture", value: manufacture },
  ];
  let material_list_tbl = await MaterialListModel.getBy("*", where);

  status = material_list_tbl["material_description"] != null ? true : false;
  status = material_list_tbl["part_number"] != null ? true : false;
  status = material_list_tbl["manufacture"] != null ? true : false;
  console.log("username has been used is " + status);
  return status;
};

MaterialListController.editmateriallist = async (req, res, next) => {
  let data = {};
  try {
    let { body } = req;
    let valid = "2";
    if (valid === "3") {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Data is not Valid"));
    } else {
      let options = [{ key: "ID", value: body["ID"] }];
      let materialData = [
        { key: "sloc", value: body["sloc"] },
        { key: "sloc_description", value: body["sloc_description"] },
        { key: "material_description", value: body["material_description"] },
        { key: "category", value: body["category"] },
        { key: "part_number", value: body["part_number"] },
        { key: "manufacture", value: body["manufacture"] },
        { key: "qty", value: body["qty"] },
        { key: "uom", value: body["uom"] },
        { key: "nett_price", value: body["nett_price"] },
      ];

      let editSuccess = await MaterialListModel.save(materialData, options);
      if (!editSuccess) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Failed to save in Database"));
      } else {
        res
          .status(200)
          .send(parseResponse(true, data, "00", "Success Edit materiallist"));
      }
    }
  } catch (error) {}
};

MaterialListController.deletemateriallist = async (req, res, next) => {
  console.log("Delete material list");
  let data = {};
  try {
    let { body } = req;
    console.log(body);
    let valid = "2";
    if (valid === "3") {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Data is not Valid"));
    } else {
      let options = [{ key: "ID", value: body["ID"] }];
      let deleteSuccess = await MaterialListModel.delete(options);
      if (!deleteSuccess) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Failed to save in Database"));
      } else {
        res
          .status(200)
          .send(parseResponse(true, data, "00", "Success delete materiallist"));
      }
    }
  } catch (error) {}
};

MaterialListController.deleteselectedmateriallist = async (req, res, next) => {
  console.log("Delete array material list");
  let data = {};
  try {
    let { body } = req;

    let options = [{ key: "ID", value: body["ID"] }];
    let deleteSuccess = await MaterialListModel.deleteArray(options);

    if (!deleteSuccess) {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Failed to save in Database"));
    } else {
      res
        .status(200)
        .send(parseResponse(true, data, "00", "Success delete materiallist"));
    }
  } catch (error) {}
};
module.exports = MaterialListController;
