exports.ldapService = {
    login: 'http://10.13.1.53/ldapservice/api/auth/Login',
}

exports.lhpbservices = {
    save: 'http://10.13.1.52/apiltc/api/report/lhpb',
}

exports.sapservice = {
    generatepo: 'http://10.13.1.52/apiltc/api/apisap/createPO',
}

exports.trakindo = {
    doservice: 'http://10.13.1.52/apiltc/api/ltc/syncCatDO',
}

exports.sapService = {
    inquiryPR: 'http://10.13.1.52/API_SAP/api/PR/inquiryPR',
    inquiryPO: 'http://10.13.1.52/API_SAP/api/PO/inquiryPO',
    createPO: 'http://10.13.1.52/API_SAP/api/PO/createPurchaseOrder',
    createGR: 'http://10.13.1.52/API_SAP/api/GR/createGoodReceipt',
}

module.exports = exports
