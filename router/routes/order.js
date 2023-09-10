const OrderController = require('../../controllers/order')

module.exports = (router) => {
    // 更新公司信息
    router.post('/getOrderList', OrderController.getOrderList);
}
