const AuthController = {};
const rp = require("request-promise");
const randomstring = require("randomstring");
const moment = require("moment");
const UsersModel = require("../models/users.model");
const parseResponse = require("../helpers/parse-response");
const { generateToken, encryptPassword } = require("../lib/jwt");
const partnersApi = require("../helpers/partner-api");
const { body } = require("express-validator");
const log = "User controller";

AuthController.login = async (req, res, next) => {
  console.log(`├── ${log} :: Login User and Generate Token`);

  try {
    let { username, password } = req.body;
    let statusCode = 200;
    let responseCode = 00;
    let message = "Login Success";
    let acknowledge = true;
    let result = null;

    let manualPwdEncrypt = await encryptPassword(password);
    let optionsSystem = [
      { key: "username", value: username },
      // { key: "password", value: manualPwdEncrypt },
    ];
    let users_tbl = await UsersModel.getBy(
      "password, source, name, idRig",
      optionsSystem
    );

    if (users_tbl.password != manualPwdEncrypt) {
      res
        .status(statusCode)
        .send(parseResponse(acknowledge, result, "05", "Password salah."));
      return;
    }

    if (users_tbl.source === "system") {
      let validatorsRandom = randomstring.generate();
      userData = [{ key: "validator", value: validatorsRandom }];
      await UsersModel.save(userData, optionsSystem);

      let userObj = {
        username: users_tbl.username,
        role: users_tbl.role,
        name: users_tbl.name,
        source: users_tbl.source,
        validator: validatorsRandom,
      };
      let tokenSystem = await generateToken(userObj);
      let rigName = await UsersModel.QueryCustom(
        "SELECT rigName FROM tb_master_rig WHERE rigId = '" +
          users_tbl.idRig +
          "'"
      );

      result = {
        token: tokenSystem,
        username: users_tbl.username,
        name: users_tbl.name,
        idRig: users_tbl.idRig,
        rig_name: rigName.rows[0].rigName,
      };
      res
        .status(statusCode)
        .send(parseResponse(acknowledge, result, responseCode, " "));

      return;
    } else if (users_tbl.source === "ldap") {
      let token = "";
      username = username.split("@")[0];
      const options = {
        method: "POST",
        url: partnersApi.ldapService.login,
        body: {
          username: username,
          password: password,
          method: "login",
        },
        json: true,
      };

      const ldap = await rp(options);
      if (ldap != null) {
        let validatorsRandom = randomstring.generate();
        let userData = null;
        let condition = [{ key: "UserID", value: username }];
        if (ldap.Status == "00") {
          let where = [
            { key: "UserID", value: username },
            { key: "Role", value: "W" },
          ];
          let users_tbl = await UsersModel.getBy(
            "UserID, Name, Email, Role, TanggalRegister, Source",
            where
          );

          userData = [{ key: "Validator", value: validatorsRandom }];
          await UsersModel.save(userData, condition);

          let userObj = {
            username: users_tbl.UserID,
            lokasi: users_tbl.LokasiStay,
            name: users_tbl.Name,
            email: users_tbl.Email,
            role: users_tbl.Role,
            tanggalRegister: users_tbl.TanggalRegister,
            source: users_tbl.Source,
            validator: validatorsRandom,
          };
          token = await generateToken(userObj);

          result = {
            token: token,
            email: users_tbl.Email,
            username: users_tbl.UserID,
            role: users_tbl.Role,
          };
        } else {
          statusCode = 200;
          responseCode = "05";
          message =
            "Incorrect Password. User not found in mail directory Pertamina.";
          acknowledge = false;
          result = null;
        }
      } else {
        statusCode = 200;
        responseCode = "99";
        message =
          "LDAP service error. Please inform servicedesk.pdsi to solve your problem. Sorry for the unconvenience.";
        acknowledge = false;
        result = null;
      }
    } else {
      statusCode = 200;
      responseCode = "05";
      message = "User not Authorize";
      acknowledge = false;
      result = null;
    }
    res
      .status(statusCode)
      .send(parseResponse(acknowledge, result, responseCode, message));
  } catch (error) {
    console.log("Error exception :" + error);
    let resp = parseResponse(false, null, "99", error);
    next({
      resp,
      status: 500,
    });
  }
};

AuthController.signup = async (req, res, next) => {
  console.log("Signup User...............");
  let data = {};
  try {
    let { body } = req;
    let valid = await AuthController.validate(body);
    if (!valid) {
      res
        .status(200)
        .send(parseResponse(false, null, "57", "Data is not Valid"));
    } else {
      let isUsed = await AuthController.checkUsageUsername(body["username"]);
      if (isUsed) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "username has been used"));
      } else {
        let pwdEncrypt = await encryptPassword(body["password"]);

        // set data
        let userData = [
          { key: "username", value: body["username"] },
          { key: "password", value: pwdEncrypt },
          { key: "name", value: body["name"] },
          { key: "source", value: "system" },
        ];

        // save data
        let insertSuccess = await UsersModel.save(userData);
        // check if suucess save
        if (!insertSuccess) {
          // if email has been used return false
          res
            .status(200)
            .send(
              parseResponse(false, null, "57", "Failed to save in Database")
            );
        } else {
          // login
          //   UsersController.login(req, res, next);
          // return succes
          res
            .status(200)
            .send(parseResponse(true, data, "00", "SignUp Process Success"));
        }
      }
    }
  } catch (error) {}
};

AuthController.changepassword = async (req, res, next) => {
  console.log("edit password");
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
      let pwdEncrypt = await encryptPassword(body["password"]);
      let pwdEncryptNewPassword = await encryptPassword(body["newpassword"]);
      let options = [
        { key: "username", value: body["username"] },
        { key: "password", value: pwdEncrypt },
      ];
      let userData = [{ key: "password", value: pwdEncryptNewPassword }];
      let users_tbl = await UsersModel.getBy(
        "username, password, source, name",
        options
      );
      if (pwdEncrypt == pwdEncryptNewPassword) {
        res
          .status(200)
          .send(
            parseResponse(
              false,
              null,
              "57",
              "Password tidak boleh sama dengan sebelumnya"
            )
          );
      }

      if (users_tbl.password != pwdEncrypt) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Password lama anda salah"));
      }

      let editSuccess = await UsersModel.save(userData, options);
      if (!editSuccess) {
        res
          .status(200)
          .send(parseResponse(false, null, "57", "Failed to save in Database"));
      } else {
        res
          .status(200)
          .send(parseResponse(true, data, "00", "Success Change Password"));
      }
    }
  } catch (error) {}
};

AuthController.validate = function (body) {
  console.log("validate data input......");
  var regexp = new RegExp("^([a-z0-9.]{5,})$");
  if (
    body["username"] == "" ||
    body["username"] == null
    // body["username"].length <= 6
    // !regexp.test(body["username"])
  )
    return false;
  if (
    body["password"] == "" ||
    body["password"] == null ||
    body["password"].length <= 1
  )
    return false;
  if (body["name"] == "" || body["name"] == null) return false;

  console.log("data valid");
  return true;
};

AuthController.checkUsageUsername = async (username) => {
  console.log("check usename used or not......");
  let status = "";
  let where = [{ key: "username", value: username }];
  let users_tbl = await UsersModel.getBy("*", where);

  status = users_tbl["username"] != null ? true : false;
  console.log("username has been used is " + status);
  return status;
};

module.exports = AuthController;
