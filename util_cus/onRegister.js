const nodemailer = require('nodemailer')
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
const Utils = require('../util/utils');
const log = require("../config/log")
/**
 * 注册完成后需要执行的方法
 */
const onRegister = ({ email, memberName, productType, orderAmount, typeOfTax, phone, name, years, projectNum, flowCount, companyId, channel}) => {
    Utils.postJson("http://localhost:8012/config/createSaasOrderForRegister", {email, memberName, productType, orderAmount, typeOfTax, phone, name, years, projectNum, flowCount, companyId, channel}).then((res) => {
        console.log(res)
    }).catch((e) => {
        log.printError("创建订单失败", e)
    })
}
module.exports = onRegister