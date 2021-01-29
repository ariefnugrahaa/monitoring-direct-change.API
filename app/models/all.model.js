const CoreDB    = require('../lib/Coredb');
const AllModel  = {}

AllModel.save = async (nameTable, data, condition = []) => {
    let result  = null;

    CoreDB.setTable(nameTable);
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

AllModel.saveFromMap = async (nameTable, data, condition = []) => {
    let result  = null;

    CoreDB.setTable(nameTable);
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.createFromMap(data);
    }

    return result;
}

AllModel.delete = async (nameTable, condition) => {
    CoreDB.setTable(nameTable);

    return await CoreDB.delete(condition);
}

AllModel.getBy = async (nameTable, fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable(nameTable);

    return await CoreDB.getBy(fields, condition, join, group);
}

AllModel.getAll = async (nameTable, fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable(nameTable);

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

AllModel.getPaging = async (nameTable, fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable(nameTable);

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

AllModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = AllModel;