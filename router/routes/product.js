const ProductController = require('../../controllers/product')

module.exports = (router) => {
    // 获取当月生效的产品
    router.post('/getProjectByCompanyIdForMonth', ProductController.getProjectByCompanyIdForMonth);
}
