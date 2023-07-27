//delete//
const ApplicationConfigModel = require('../modules/applicationConfig')
const statusCode = require('../util/status-code')
const Utils = require('../util/utils');
var { accountInfo } = require("../config/AccountConfig")
var { feiShuConfig } = require("../sso")
const Consts = require('../config/consts')
const { PROJECT_API } = Consts
const log = require("../config/log")
const fetch = require('node-fetch');
const UserModel = require('../modules/user');
const UserController = require('./user');
//delete//
class ApplicationConfigController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await ApplicationConfigModel.createApplicationConfig(req);
            let data = await ApplicationConfigModel.getApplicationConfigDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateSysConfigInfo(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { serverDomain, adminDomain, editType } = param

        // 先检查对应配置是否存在
        const checkRes = await ApplicationConfigModel.getApplicationConfigByConfigName(editType)
        if (checkRes && checkRes.length) {
            // 如果存在，则更新
            await ApplicationConfigModel.updateApplicationConfig(editType, {configValue: JSON.stringify({serverDomain, adminDomain})})
        } else {
            // 如果不存在，则新建
            await ApplicationConfigModel.createApplicationConfig({systemName: editType, configValue: JSON.stringify({serverDomain, adminDomain})})
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }

    /**
     * 更新域名配置信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async setInitSysConfigInfo(serverDomain, adminDomain, editType) {
        // 如果对应配置不存在，则新建
        const checkRes = await ApplicationConfigModel.getApplicationConfigByConfigName(editType)
        if (checkRes && checkRes.length === 0) {
            await ApplicationConfigModel.createApplicationConfig({systemName: editType, configValue: JSON.stringify({serverDomain, adminDomain})})
        }
    }

    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getSysConfigInfo(ctx) {
        const { monitorServerDomain, monitorAssetsDomain, eventServerDomain, eventAssetsDomain, emailNeeded, phoneNeeded, activationRequired } = accountInfo
        const res = {
            monitor: {
                serverDomain: monitorServerDomain,
                adminDomain: monitorAssetsDomain,
            },
            event: {
                serverDomain: eventServerDomain,
                adminDomain: eventAssetsDomain,
            },
            emailNeeded,
            phoneNeeded,
            activationRequired
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    }
    /**
     * 获取基础配置
     */
    static async handleAllApplicationConfig() {
        const systemRes = await ApplicationConfigModel.getAllApplicationConfig()
        let monitor = {}
        let event = {}
        systemRes.forEach((sysItem) => {
            const configValue = JSON.parse(sysItem.configValue)
            switch(sysItem.systemName) {
                case "monitor":
                    monitor = configValue
                    break
                case "event":
                    event = configValue
                    break
                default:
                    break
            }
        })
        return {
            monitor, event
        }
    }
    /**
     * 获取监控的基本信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async monitorBaseInfo(ctx) {
        const appConfig = await ApplicationConfigController.handleAllApplicationConfig()
        const { monitor } = appConfig

        const monitorBaseRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.MONITOR_BASE_INFO}`, {})
        if (!monitorBaseRes) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('监控系统基本信息获取失败!')
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', monitorBaseRes.data)
        }
    }
    /**
     * 获取埋点的基本信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async eventBaseInfo(ctx) {
        const appConfig = await ApplicationConfigController.handleAllApplicationConfig()
        const { event } = appConfig

        const eventBaseRes = await Utils.requestForTwoProtocol("post", `${event.serverDomain}${PROJECT_API.EVENT_BASE_INFO}`, {})
        if (!eventBaseRes) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('监控系统基本信息获取失败!')
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', eventBaseRes.data)
        }
    }

    /**
     * 获取第三方token
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getOtherAccessTokenWithCode(ctx) {
        const { code } = JSON.parse(ctx.request.body)
        const { getTokenConfig, getUserInfoConfig } = feiShuConfig
        const params = {
            grant_type: "authorization_code",
            client_id: feiShuConfig.client_id,
            client_secret: feiShuConfig.client_secret,
            redirect_uri: feiShuConfig.redirect_uri,
            code
        }
        const tokenRes = await Utils.postForm(getTokenConfig.url, params).catch((e) => {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e.msg, 0)
        })
        console.log(tokenRes)
        if (tokenRes && tokenRes.code === 200) {
            const { access_token } = tokenRes.data
            // 根据access_token获取用户信息
            const userInfoRes = await Utils.postForm(getUserInfoConfig.url, {access_token}).catch((e) => {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(e.msg, 0)
            })
            console.log(userInfoRes)
            if (userInfoRes && userInfoRes.code === 200) {
                const { username = "", mobile = "", email = "" } = userInfoRes.data
                if (!mobile && !email) {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412("登录失败，手机号和邮箱都为空！", 0)
                    return
                }
                // 检查账号是否存在
                const existUsers = await UserModel.checkUserByPhoneOrEmail(mobile, email)
                if (!existUsers || !existUsers.length) {
                    // 账号不存在，则创建一个
                    const userData = {
                        companyId: "1",
                        nickname: username || "no name",
                        emailName: email || mobile,
                        phone: mobile || email,
                        password: Utils.md5(Utils.getUuid()),
                        userId: Utils.getUuid(),
                        userType: "customer",
                        registerStatus: 1,
                        avatar: Math.floor(Math.random() * 6)
                    }
                    let userRet = await UserModel.createUser(userData);
                    if (userRet && userRet.id) {
                        const accessToken = await UserController.createSsoToken(mobile, email)
                        if (accessToken) {
                            ctx.response.status = 200;
                            ctx.body = statusCode.SUCCESS_200('success', {
                                accessToken
                            })
                        } else {
                            ctx.response.status = 412;
                            ctx.body = statusCode.ERROR_412("登录失败，账号无效或不存在！", 0)
                        }
                    }
                }
            } else {
                console.log(userInfoRes)
                log.printError(`获取第三方用户信息失败（${getUserInfoConfig.url}）`, userInfoRes)
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(tokenRes.msg, tokenRes.msg)
            }
        } else {
            console.log(tokenRes)
            log.printError(`获取第三方token失败（${getTokenConfig.url}）`, tokenRes)
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(tokenRes.msg, tokenRes.msg)
        }
    }
}
//exports//
module.exports = ApplicationConfigController
//exports//