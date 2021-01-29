const AllModel                  = require('../models/all.model')
const CurrentStatMiddleware     = {}
const log                   = 'Current Status'

const trxPembelianTable   = 'trx_pembelian'
const masterProsesTable   = 'rf_proses'

CurrentStatMiddleware.getData = async (req, res, next) => {
    console.log(`├── ${log} :: Current Status`);
    
    try {    
        let {
            ReqID
        } = req.body

        if (ReqID) {
            let options     = [
                { key: 'ReqID', value: ReqID }
            ]

            let trxPembelian        = await AllModel.getBy(trxPembelianTable, '*', options)
console.log(options)
            req.deksripsiPermintaan = trxPembelian

            let optionsProses       = [
                { key: 'RecentStatus', value: trxPembelian.ReqStatus },
                { key: 'IsAktif', value: '1' }
            ]

            let prosesData          = await AllModel.getBy(masterProsesTable, 'OnApproved, OnReject, AlternateProcess', optionsProses)

console.log('prosesData')
console.log(prosesData)
            req.curentStatus        = trxPembelian.ReqStatus
            req.onApproved          = prosesData.OnApproved
            req.onReject            = prosesData.OnReject
            req.alternateProcess    = prosesData.AlternateProcess
            req.createdBy           = trxPembelian.CreatedBy

            next()
        }else{
            res.status(401).send(
                parseResponse(false, [], '99', 'Problem on load current status')
            )
        }
        
    } catch (error) {
        res.status(401).send(
            parseResponse(false, [], '99', `Error Exception currentstat middleware ${error}`)
        )
    }
}

module.exports = CurrentStatMiddleware