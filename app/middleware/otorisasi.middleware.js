const AllModel = require('../models/all.model')
const OtorisasiMiddleware = {}
const log = 'Otorisasi Check'

const trxPembelianTable = 'trx_pembelian'
const userTable = 'user'

OtorisasiMiddleware.check = async (req, res, next) => {
    console.log(`├── ${log} :: Otorisasi Check`);

    try {
        let {
            ReqID,
            NextPhase
        } = req.body

        const { currentUser: { body: { username: username } } } = req

        if ((NextPhase == "") || (NextPhase == undefined)) {

            let options = [
                { key: 'UserID', value: username }
            ]

            let dataUser = await AllModel.getBy(userTable, 'Role, StatusUser', options)

            if (dataUser.StatusUser == "A") {
                if (dataUser.Role == "M") {
                    //For create new transaction -> saving new transaction
                    //Only user with M role is allowed to saving or creating new transaction
                    next()
                } else {
                    res.status(401).send(
                        parseResponse(false, [], '04', 'Sorry. You are not authorized to perform the requested action.\nPlease contact Servicedesk PDSI for more details.')
                    )
                }
            } else {
                //Non aktif user
                res.status(401).send(
                    parseResponse(false, [], '04', 'Your userid is not active.\nPlease contact Servicedesk PDSI for more details.')
                )
            }

        } else {
            //for submit, approve, reject, postingpo
            if (ReqID) {
                let options = [
                    { key: 'UserID', value: username }
                ]

                let dataUser = await AllModel.getBy(userTable, 'Role, StatusUser', options)

                if (dataUser.StatusUser == "N") {
                    //Non aktif user
                    res.status(401).send(
                        parseResponse(false, [], '04', 'Your userid is not active.\nPlease contact Servicedesk PDSI for more details.')
                    )
                } else {

                    if (dataUser.Role == "W") {
                        //for workshop officer
                        if ((NextPhase == "approve") || (NextPhase == "reject" || NextPhase == "received")) {
                            next()
                        } else {
                            res.status(401).send(
                                parseResponse(false, [], '04B', 'Sorry. You are not authorized to perform the requested action.\nPlease contact Servicedesk PDSI for more details.')
                            )
                        }
                    } else {
                        res.status(401).send(
                            parseResponse(false, [], '04A', 'Sorry. You are not authorized to perform the requested action.\nPlease contact Servicedesk PDSI for more details.')
                        )
                    }
                }
            } else {
                res.status(401).send(
                    parseResponse(false, [], '99', 'Uncomplete data. Transaction number is required.')
                )
            }
        }
    } catch (error) {
        res.status(401).send(
            parseResponse(false, [], '99', `Error Exception currentstat middleware ${error}`)
        )
    }
}

module.exports = OtorisasiMiddleware