module.exports = parseResponse = (acknowledge, data, code, message = 'Something went wrong') => {
    if (code != "00")
    {
        acknowledge = false
    }
    
    const response = 
        {
            "acknowledge": acknowledge,
            "responseCode": code,
            "responseMessage": message,
            "responseData": data,
        }
    return response
}