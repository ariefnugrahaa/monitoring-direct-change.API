const CoreDB            = require('../lib/Coredb');
const LogActivityModel        = {}

const nameTable         = 'log_activity'

LogActivityModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable(nameTable);
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

LogActivityModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable(nameTable);

    return await CoreDB.getBy(fields, condition, join, group);
}

LogActivityModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable(nameTable);

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

LogActivityModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}

module.exports  = LogActivityModel;