const Utils = require('../util/utils');
const log = require("../config/log")
const Consts = require('../config/consts')
const { PROJECT_API, PRODUCT_INFO_URI } = Consts
/**
 * 查询订单产品列表数据
 */
const queryOrderProductList = async () => {
    const url = `${PRODUCT_INFO_URI}${PROJECT_API.SAAS_PRODUCT_INFO}`
    let productRes = {}
    try {
        const { data = {} } = await Utils.requestForTwoProtocol("post", url)
        productRes = data
    } catch (error) {
        log.printError("queryOrderProductList->查询订单产品列表失败", error)
    }
    return productRes
}
module.exports = queryOrderProductList