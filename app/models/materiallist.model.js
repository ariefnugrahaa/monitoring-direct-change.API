const CoreDB = require("../lib/Coredb");
const MaterialistModel = {};

const nameTable = "tb_master_material";

MaterialistModel.save = async (data, condition = []) => {
  let result = null;

  CoreDB.setTable(nameTable);
  if (condition.length > 0) {
    result = await CoreDB.update(data, condition);
  } else {
    result = await CoreDB.create(data);
  }

  return result;
};

MaterialistModel.delete = async (condition) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.delete(condition);
};

MaterialistModel.deleteArray = async (condition) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.deleteArray(condition);
};

MaterialistModel.getBy = async (
  fields = "*",
  condition,
  join = [],
  group = []
) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.getBy(fields, condition, join, group);
};

MaterialistModel.getAll = async (
  fields = "*",
  condition = [],
  join = [],
  group = [],
  sort = []
) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.getAll(fields, condition, join, group, sort);
};

MaterialistModel.getPaging = async (
  fields = "*",
  condition = [],
  join = [],
  group = [],
  sort = [],
  page = 1
) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
};

MaterialistModel.QueryCustom = async (query, value = []) => {
  const result = await CoreDB.query(query, value);
  return result.rows;
};

module.exports = MaterialistModel;
