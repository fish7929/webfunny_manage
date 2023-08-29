const CompanyController = require('../../controllers/company')

module.exports = (router) => {
    // 更新公司信息
    router.post('/updateCompany', CompanyController.updateCompany);
    // 获取公司信息
    router.post('/getCompanyInfo', CompanyController.getCompanyInfo);
    // 获取公司列表
    router.post('/getCompanyList', CompanyController.getCompanyList);
}
