const nodemailer = require('nodemailer')
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
const Utils = require('../util/utils');
const log = require("../config/log")
const ProductController = require('../controllers/product')
/**
 * 注册完成后需要执行的方法
 */
const onRegister = (param) => {
    Utils.postJson("http://localhost:8012/config/createSaasOrderForRegister", param).then((res) => {
        console.log(res)
        //立即同步产品信息
        ProductController.batchCreateOrUpdateProduct()
    }).catch((e) => {
        log.printError("创建订单失败", e)
    })
}
module.exports = onRegister