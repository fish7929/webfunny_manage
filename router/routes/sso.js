const ApplicationConfigController = require('../../controllers/applicationConfig')

module.exports = (router) => {
  // 获取飞书的
  router.get("/getSignatureForFeiShu", ApplicationConfigController.getSignatureForFeiShu)
  // 飞书获取用于信息
  router.get("/getAccessTokenByCodeForFeiShu", ApplicationConfigController.getAccessTokenByCodeForFeiShu)
}
