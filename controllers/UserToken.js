//delete//
const UserTokenModel = require('../modules/UserToken')
const statusCode = require('../util/status-code')
//delete//
class UserTokenController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await UserTokenModel.createUserToken(req);
            let data = await UserTokenModel.getUserTokenDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllTokens() {
        const userTokens = await UserTokenModel.getAllTokens()
        return userTokens
    }

    static async getUserTokenDetailByToken(token) {
        const userTokenDetail = await UserTokenModel.getUserTokenDetailByToken(token)
        return userTokenDetail
    }

    static async getUserTokenFromNetworkByToken(ctx) {
        let param = ctx.request.body;
        const userTokenDetail = await UserTokenModel.getUserTokenDetailByToken(param.token)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', userTokenDetail)
    }
}
//exports//
module.exports = UserTokenController
//exports//