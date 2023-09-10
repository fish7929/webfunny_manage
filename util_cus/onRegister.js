const nodemailer = require('nodemailer')
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
const Utils = require('../util/utils');
const log = require("../config/log")
/**
 * 注册完成后需要执行的方法
 */
const onRegister = (param) => {
    Utils.postJson("http://localhost:8012/config/createSaasOrderForRegister", param).then((res) => {
        console.log(res)
    }).catch((e) => {
        log.printError("创建订单失败", e)
    })
}
module.exports = onRegister