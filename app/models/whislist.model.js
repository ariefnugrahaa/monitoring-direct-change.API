const CoreDB = require("../lib/Coredb");
const WhislistModel = {};

const nameTable = "tb_header_whislist";

WhislistModel.save = async (data, condition = []) => {
  let result = null;

  CoreDB.setTable(nameTable);
  if (condition.length > 0) {
    result = await CoreDB.update(data, condition);
  } else {
    result = await CoreDB.create(data);
  }

  return result;
};

WhislistModel.delete = async (condition) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.delete(condition);
};

WhislistModel.deleteArray = async (condition) => {
  CoreDB.setTable(nameTable);
  return await CoreDB.deleteArray(condition);
};

WhislistModel.getBy = async (
  fields = "*",
  condition,
  join = [],
  group = []
) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.getBy(fields, condition, join, group);
};

WhislistModel.getAll = async (
  fields = "*",
  condition = [],
  join = [],
  group = [],
  sort = []
) => {
  CoreDB.setTable(nameTable);

  return await CoreDB.getAll(fields, condition, join, group, sort);
};

WhislistModel.getPaging = async (
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

WhislistModel.QueryCustom = async (query, value = []) => {
  const result = await CoreDB.query(query, value);
  return result.rows;
};

module.exports = WhislistModel;
