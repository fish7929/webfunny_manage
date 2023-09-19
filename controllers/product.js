//delete//
const ProductModel = require('../modules/product')
const statusCode = require('../util/status-code')
const queryOrderProductList = require('../util_cus/queryOrderProductList')
const log = require("../config/log")
//delete//
class ProductController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        const data = await ProductModel.createProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }
    /**
     * 根据公司ID获取当月流量套餐
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectByCompanyIdForMonth(ctx) {
        const { companyId } = ctx.wfParam
        const month = new Date().Format("yyyy-MM")
        const data = await ProductModel.getProjectByCompanyIdForMonth(companyId, month);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }

    /**
     * 创建新产品
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewProduct(ctx) {
        let req = ctx.request.body;
        const data = await ProductModel.createProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }

    /**
     * 批量创建新和更新产品
     * @param newProductList  ex: [{productType, companyId, endDate, flowCount, orderId, month}, ....]
     * @param expireOrderIds   ex: ["S230910G4SYRC7GHH", "S2309127AACKX2PPH", ....]
     * @returns {Promise.<void>}
     */
    static async batchCreateOrUpdateProduct(ctx) {
        let params = [] //需要新增的数据列表
        let allOrderIds = [] //当成新增或者失效的全部订单列表
        let ids = []  //失效订单列表
        let newList = []  //新增列表
        let expireList = [] //失效列表
        try {
            const { newProductList = [], expireOrderIds = [] } = await queryOrderProductList()
            newList = newProductList;
            expireList = expireOrderIds;
        } catch (error) {
            log.printError("获取订单列表失败", error)
        }
        if (newList.length) {
            params = newList.map(prod => {
                //订阅包  60-69
                // SAAS_FREE_TRAFFIC_SUBSCRIPTION(60,"免费版流量订阅"), 
                // SAAS_SHARE_TRAFFIC_PACKET(61,"分享版流量订阅"), 
                // SAAS_TRAFFIC_SUBSCRIPTION(62,"企业版流量订阅"), 
                //流量包 70-79
                // SAAS_TRAFFIC_PACKET(70,"免费版流量包"),
                // SAAS_TRAFFIC_PACKET(71,"分享版流量包"),
                // SAAS_TRAFFIC_PACKET(72,"企业版流量包"),
                const { productType, companyId, endDate, flowCount, orderId, month } = prod
                allOrderIds.push(orderId)
                return {
                    companyId,
                    endDate,
                    orderId,
                    month,
                    productType,
                    maxFlowCount: flowCount,
                    usedFlowCount: 0,
                    isValid: 1
                }
            });
        }
        if (expireList.length) {
            ids = expireList
            allOrderIds = [...allOrderIds, ...ids]
        }
        if (allOrderIds.length) {
            // console.log("allOrderIds", allOrderIds)
            //TODO 此处可能会有内存问题，一次查询太多订单号
            //批量查询当次需要操作的所有订单id有效的产品
            const curAllProducts = await ProductModel.batchQueryProductByOrderId(allOrderIds);
            const curMonth = new Date().Format("yyyy-MM")
            // console.log('curAllProducts', curAllProducts)
            //新增列表中剔除，数据库中已经存在有效的相同产品信息
            params = params.filter(param => {
                const { orderId, month, companyId } = param
                //所有列表中， 存在当前有效产品剔除掉
                return curAllProducts.length ? !(!!curAllProducts.find(curProd => curProd.orderId === orderId && curProd.companyId === companyId && curProd.month === month)) : true
            })
            if (expireList.length) {
                //筛选出来当月失效的产品
                const curMonthExpireProduct = curAllProducts.filter(item => item.month === curMonth && expireList.includes(item.orderId))
                //在新增的数据中，找到当月新增的数据，追加上需要设置失效的 已使用流量和总流量
                params = params.map(newParam => {
                    const { month, companyId } = newParam
                    let obj = { ...newParam }
                    const addProd = curMonthExpireProduct.find(expProd => expProd.month === month && expProd.companyId === companyId) || null
                    if (addProd) {
                        obj.usedFlowCount += addProd.usedFlowCount || 0
                        obj.maxFlowCount += addProd.maxFlowCount || 0
                    }
                    return obj
                })
            }
            // console.log("start 批量创建或者批量更新流量套餐产品 -->", ids, params);
            //批量更新，旧产品为失效状态
            if (ids.length) {
                await ProductModel.batchUpdateProductByOrderId(ids, { isValid: 0 });
            }
            //先批量创建
            if (params.length) {
                await ProductModel.batchCreateProduct(params);
            }
            // console.log("curAllProducts", curAllProducts)
            console.log("批量创建或者批量更新流量套餐产品成功！！！");
            // ctx.response.status = 200;
            // ctx.body = statusCode.SUCCESS_200('创建信息成功', { curAllProducts, params })
        }
    }


    /**
     * 批量创建新产品
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async batchCreateProduct(ctx) {
        let req = ctx.request.body;
        const data = await ProductModel.batchCreateProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('批量创建信息成功', data)
    }

    /**
    * 批量更新产品
    * @param ctx
    * @returns {Promise.<void>}
    */
    static async batchUpdateProduct(ctx) {
        const { ids } = ctx.wfParam
        const data = await ProductModel.batchUpdateProductByOrderId(ids, { isValid: 1 });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('批量更新信息成功', data)
    }
}
//exports//
module.exports = ProductController
//exports//