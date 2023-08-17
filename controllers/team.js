//delete//
const TeamModel = require('../modules/team')
const UserModel = require('../modules/user')
const ApplicationConfigModel = require('../modules/applicationConfig')
// const ProjectModel = require('../modules/project')
const log = require("../config/log")
const Utils = require('../util/utils');
const statusCode = require('../util/status-code')
const Consts = require('../config/consts')
const { PROJECT_API } = Consts
//delete//
class TeamController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await TeamModel.createTeam(req);
            let data = await TeamModel.getTeamDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async createNewTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { teamName } = param
        const { userId, companyId } = ctx.user
        const team = {teamName, leaderId: userId, members: userId, webMonitorIds: "", companyId}
        const teamRes = await TeamModel.createTeam(team);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', teamRes)
    }

    static async createNewTeamForApi(ctx) {
        const { teamName, userId } = ctx.request.body
        const team = {teamName, leaderId: userId, members: userId, webMonitorIds: ""}

        const teamDetail = await TeamModel.getTeamDetailByName(teamName)
        if (teamDetail) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('团队名称重复！')
            return
        }
        const teamInfo = await TeamModel.createTeam(team);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('团队创建成功', teamInfo)
    }

    static async deleteTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        const delRes = await TeamModel.deleteTeam(id)

        if (delRes) {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('团队删除成功', 0)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('团队删除失败！')
        }
        
        // 删除前，先检查team下是否还有团队
        // const teamDetail = await TeamModel.getTeamDetail(id)
        // const webMonitorIds = teamDetail.webMonitorIds
        // const projects = await ProjectModel.getProjectByWebMonitorIds(webMonitorIds)
        // if (projects.length <= 0) {
        //     await TeamModel.deleteTeam(id)
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200('success', "")
        // } else {
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200('success', "当前team下还有项目，无法执行删除操作！")
        // }
        
    }

    static async moveProToTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { showMoveMonitorId, chooseTeamId } = param
        const team = await TeamModel.getTeamDetail(chooseTeamId)
        const tempProjects = team.webMonitorIds + "," + showMoveMonitorId
        await TeamModel.updateTeam(chooseTeamId, {webMonitorIds: tempProjects})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

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

    static async handleTeamList(userId, userType) {
        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        const res = await TeamModel.getTeamList(userId, userType)
        for (let i = 0; i < res.length; i ++) {
            const team = res[i]
            const { leaderId, members, webMonitorIds } = team
            const users = await UserModel.getUserListByMembers(members)
            team.members = users
            users.forEach((user) => {
                if (user.userId == leaderId) {
                    team.leader = user
                    return false
                }
            })

            const projectRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.MONITOR_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS}`, {webMonitorIds})

            const projects = projectRes ? projectRes.data : []

            for (let m = 0; m < projects.length; m ++) {
                let projectItem = projects[m]
                const { viewers } = projectItem
                projectItem.id = "m-" + projectItem.id
                projectItem.sysType = "monitor"
                const viewerList = await UserModel.getUserListByViewers(viewers)
                projectItem.viewerList = viewerList
            }

            const eventProjectRes = await Utils.requestForTwoProtocol("post", `${event.serverDomain}${PROJECT_API.EVENT_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS}`, {webMonitorIds})

            const eventProjects = eventProjectRes ? eventProjectRes.data : []

            for (let m = 0; m < eventProjects.length; m ++) {
                let projectItem = eventProjects[m]
                const {viewers} = projectItem
                // 埋点项目需要补全的三个字段
                projectItem.projectType = "event"
                projectItem.sysType = "event"
                projectItem.id = "e-" + projectItem.id

                const viewerList = await UserModel.getUserListByViewers(viewers)
                projectItem.viewerList = viewerList
            }

            team.projects = [...projects, ...eventProjects]
        }
        return res
    }


    static async getTeamList(ctx) {
        let userId = ""
        let userType = ""
        if (ctx.user) {
            userId = ctx.user.userId
            userType = ctx.user.userType
        } else {
            const param = ctx.request.body
            userId = param.userId
            userType = param.userType
        }
        const res = await TeamController.handleTeamList(userId, userType)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async getSimpleTeamList(ctx) {
        let userId = ""
        let userType = ""
        if (ctx.user) {
            userId = ctx.user.userId
            userType = ctx.user.userType
        } else {
            const param = ctx.request.body
            userId = param.userId
            userType = param.userType
        }
        const res = await TeamModel.getTeamList(userId, userType)
        // for (let i = 0; i < res.length; i ++) {
        //     const team = res[i]
        //     const { leaderId, members, webMonitorIds } = team
        //     const users = await UserModel.getUserListByMembers(members)
        //     team.members = users
        //     users.forEach((user) => {
        //         if (user.userId == leaderId) {
        //             team.leader = user
        //             return false
        //         }
        //     })
        // }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async getTeamMemberByUser(ctx) {
        const {members} = JSON.parse(ctx.request.body)
        const users = await UserModel.getUserListByMembers(members)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', users)
    }

    static async getTeamListWithoutToken(ctx) {
        const param = ctx.request.body
        const { userId, userType } = param
        const res = await TeamController.handleTeamList(userId, userType)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async getTeams(ctx) {
        let userId = ""
        let userType = ""
        if (ctx.user) {
            userId = ctx.user.userId
            userType = ctx.user.userType
        } else {
            const param = ctx.request.body
            userId = param.userId
            userType = param.userType
        }
        
        const res = await TeamModel.getTeamList(userId, userType)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async addTeamMember(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id, members } = param
        await TeamModel.updateTeam(id, {members})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async updateTeamProjects(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id, webMonitorIds } = param
        // 获取id下这个team的webMonitorIds
        const teamResDetail = await TeamModel.getTeamDetail(id)
        const tempMonitorIds = teamResDetail ? teamResDetail.webMonitorIds.split(",") : ""
        const webMonitorIdArray = []
        tempMonitorIds.forEach((monitorId) => {
            if (webMonitorIds !== monitorId) {
                webMonitorIdArray.push(monitorId)
            }
        })
        await TeamModel.updateTeam(id, {webMonitorIds: webMonitorIdArray.toString()})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async getAllTeamList(ctx) {
        const res = await TeamModel.getAllTeamList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async getTeamMembersByWebMonitorId(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { webMonitorId } = param
        const memberRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        const members = memberRes && memberRes.length > 0 ? memberRes[0].members.split(",") : []
        const userRes = await UserModel.getUsersByUserIds(members)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', userRes)
    }

    static async resetTeamLeader(ctx) {
        let param = JSON.parse(ctx.request.body);
        const targetUserId = param.userId
        const teamId = param.teamId
        const { userId, userType } = ctx.user
        if (userType !== "admin" && userType !== "superAdmin") {
            // 判断当前这个登录人是不是team leader
            const teamListByLeader = await TeamModel.checkTeamLeader(teamId, userId)
            if (!teamListByLeader || !teamListByLeader.length) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('您不是团长，没有权限操作！')
                return
            }
        }
        
        // 判断目标userId是不是团队成员
        const teamListByMember = await TeamModel.checkTeamMember(teamId, targetUserId)
        if (!teamListByMember || !teamListByMember.length) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('目标不是团队成员，无法执行此操作！')
            return
        }
        // 更新新团长
        await TeamModel.updateTeam(teamId, {leaderId: targetUserId})

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }
    static async findTeamListByLeaderId(ctx) {
        let param = ctx.request.body
        const { userId } = param
        const teamList = await TeamModel.findTeamListByLeaderId(userId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', teamList)
    }
    static async getTeamDetail(ctx) {
        let param = ctx.request.body
        const { chooseTeamId } = param
        const teamResDetail = await TeamModel.getTeamDetail(chooseTeamId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', teamResDetail)
    }
    static async updateTeam(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorIds } = param
        const teamResDetail = await TeamModel.getTeamDetail(id)
        const finalWebMonitorIds = teamResDetail.webMonitorIds + "," + webMonitorIds
        await TeamModel.updateTeam(id, {webMonitorIds: finalWebMonitorIds})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async addViewers(ctx) {
        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        const {webMonitorId, viewerList, sysType} = JSON.parse(ctx.request.body)
        const viewers = viewerList.toString()
        if (sysType === "monitor") {
            // await Utils.postJson(`http://${monitor.serverDomain}${PROJECT_API.MONITOR_ADD_VIEWERS}`, {webMonitorId, viewers}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('观察者添加失败!')
            // })
            const addRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.MONITOR_ADD_VIEWERS}`, {webMonitorId, viewers})
            if (!addRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('观察者添加失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }

        } else if (sysType === "event") {
            // await Utils.postJson(`http://${event.serverDomain}${PROJECT_API.EVENT_ADD_VIEWERS}`, {webMonitorId, viewers}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('观察者添加失败!')
            // })
            const addRes = await Utils.requestForTwoProtocol("post", `${event.serverDomain}${PROJECT_API.EVENT_ADD_VIEWERS}`, {webMonitorId, viewers})
            if (!addRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('观察者添加失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }
        }
        
    }
    static async forbiddenRightCheck(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }


    static async forbiddenProject(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }

        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        if (sysType === "monitor") {
            const tempId = id.split("-")[1]
            // 更新监控项目禁用状态
            // await Utils.postJson(`http://${monitor.serverDomain}${PROJECT_API.FORBIDDEN_PROJECT}`, {id: tempId}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('禁用失败')
            // })

            const forbiddenRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.FORBIDDEN_PROJECT}`, {id: tempId})
            if (!forbiddenRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('禁用失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }
        } else if (sysType === "event") {
            // 更新埋点项目禁用状态
            
        }
    }
    static async deleteProjectRightCheck(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async deleteProject(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }

        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        if (sysType === "monitor") {
            const tempId = id.split("-")[1]
            // 更新监控项目禁用状态
            // await Utils.postJson(`http://${monitor.serverDomain}${PROJECT_API.DELETE_PROJECT}`, {id: tempId}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('禁用失败')
            // })

            const delRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.DELETE_PROJECT}`, {id: tempId})
            if (!delRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('删除失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }
        } else if (sysType === "event") {
            // 更新埋点项目禁用状态

        }


        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
}
//exports//
module.exports = TeamController
//exports//