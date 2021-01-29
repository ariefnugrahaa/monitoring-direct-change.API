const rfParameter   = {}
const AllModel      = require('../models/all.model')
const roleHelper    = require('../helpers/role-response')
const nameTable     = 'rf_parameter'
const nameTableUser = 'user'
const nameTablePembelian = 'trx_pembelian'

rfParameter.getData = async(name) => {
    let options     = [
        { key: 'name', value: name }
    ]
    let result   = await AllModel.getBy(nameTable, 'data', options)
    
    return result.data
}

rfParameter.updateData = async(name, nextData) => {
    let options     = [
        { key: 'name', value: name }
    ]
    let data        = [{ key: 'data', value : nextData }]
    await AllModel.save(nameTable, data, options)

    return result.data
}

rfParameter.getOtorisasiByIdPembelian = async(userid, idPembelian) => {
    let options     = [
        { key: 'UserID', value: userid }
    ]
    let dataRole        = await AllModel.getBy(nameTableUser, '*', options)

    let responseData = []
    responseData.data = dataRole
    if(dataRole.Role == "W"){
        //for workshop worker
        let optionsPembelian     = [
            { key: 'ID', value: idPembelian }
        ]
        let dataPembelian   = await AllModel.getBy(nameTablePembelian, '*', optionsPembelian)
        
        if (dataPembelian.ReqStatus == "P6"){
            responseData.roles = roleHelper.responseP6
        } else {
            responseData.roles = roleHelper.responseDefault
        }

    } else if(dataRole.Role == "A"){
        //for approval
        let optionsPembelian     = [
            { key: 'ID', value: idPembelian }
        ]
        let dataPembelian   = await AllModel.getBy(nameTablePembelian, '*', optionsPembelian)
        
        if(dataPembelian.CreatedBy == userid){ //dibikin oleh dia sendiri
            responseData.roles = roleHelper.responseDefault
        } else {
            if(dataPembelian.Approval == userid) {
                if(dataPembelian.ReqStatus == "P2"){
                    responseData.roles = roleHelper.responseP2
                } else if(dataPembelian.ReqStatus == "P4"){
                    responseData.roles = roleHelper.responseP4
                } else {
                    responseData.roles = roleHelper.responseDefault
                }
            } else {
                responseData.roles = roleHelper.responseDefault
            }
        }
    } else {
        responseData.roles = roleHelper.responseDefault
    }
    
    return responseData
}

module.exports = rfParameter