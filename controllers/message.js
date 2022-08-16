//delete//
const MessageModel = require('../modules/message')
const UserModel = require('../modules/user')
const statusCode = require('../util/status-code')
const Utils = require('../util/utils');
//delete//
class MessageController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewMessage(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { id, ruleName, loopTime, quietStartTime, quietEndTime } = req
        const ruleList = JSON.stringify(req.ruleList)
        const paramData = { ruleName, loopTime, quietStartTime, quietEndTime, ruleList }
        if (ruleName) {
            if (id) {
                paramData.id = id
                await MessageModel.updateMessage(id, paramData)
            } else {
                await MessageModel.createMessage(paramData);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllMessage(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        let data = await MessageModel.getAllMessage(params);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    }

    static async getMessageByType(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { userId } = ctx.user
        params.userId = userId
        // 获取分页消息
        let data = await MessageModel.getMessageByType(params);
        // 获取有多少条未读消息
        let readCountInfo = await MessageModel.getUnReadMessageCountByType(params);
        let unReadCount = 0
        let total = 0
        if (readCountInfo) {
            readCountInfo.forEach((readInfo) => {
                if (readInfo.isRead === 0) {
                    unReadCount = parseInt(readInfo.count, 10)
                }
                total += parseInt(readInfo.count, 10)
            })
        }
        const result = {
            messages: data,
            unReadCount,
            total,
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    }

    static async readMessage(ctx) {
        let req = JSON.parse(ctx.request.body)
        const { messageId } = req
        const message = MessageModel.getMessageDetail(messageId)
        message.isRead = 1
        await MessageModel.updateMessage(messageId, message);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', 0)
    }

    static async readAll(ctx) {
        let req = JSON.parse(ctx.request.body)
        const { messageType } = req
        const { userId } = ctx.user
        MessageModel.readAll(userId, messageType)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', 0)
    }

    /**
     * 查询单条信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(id) {
        return await MessageModel.getMessageDetail(id)
    }

    static async deleteMessage(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        await MessageModel.deleteMessage(id)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    // 最新的更新日志写入到日志表中
    static async saveLastVersionInfo() {
        await Utils.get("http://www.webfunny.cn/config/lastVersionInfo", {}).then(async(result) => {
            const updateInfo = result.data
            const { updateDate, version, updateContent, upgradeGuide, updateDatabase } = updateInfo
            const currentDate = new Date().Format("yyyy-MM-dd")
            // 如果日期相同，说明是今天的，可以入库
            if (updateDate === currentDate) {
                const userList = await UserModel.getAllUserInfoForSimple()
                userList.map(async(userInfo) => {
                    const { userId } = userInfo
                    await MessageModel.createMessage({
                        userId,
                        title: `版本号：${version}`,
                        content: JSON.stringify([updateContent, upgradeGuide, updateDatabase]),
                        type: "update",
                        isRead: 0,
                        link: "https://www.webfunny.cn/update.html"
                    })
                })
            }
        }).catch((error) => {
            console.error(error)
        })
    }
}
//exports//
module.exports = MessageController
//exports//