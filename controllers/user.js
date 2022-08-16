//delete//
const UserModel = require('../modules/user')
const UserTokenModel = require('../modules/UserToken')
const MessageModel = require('../modules/message')
const ConfigModel = require('../modules/config')
const statusCode = require('../util/status-code')
const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const fetch = require('node-fetch')
const Utils = require('../util/utils');
const CusUtils = require('../util_cus')
const AccountConfig = require('../config/AccountConfig')
const { USER_INFO } = require('../config/consts')
const { accountInfo } = AccountConfig
//delete//

class UserController {
  /**
   * webfunny
   */
  static sendEmail(email, title, content) {

    if (accountInfo.useCusEmailSys === true) {
      CusUtils.sendEmail(email, title, content, accountInfo.emailUser, accountInfo.emailPassword)
    } else {
      fetch("http://www.webfunny.cn/config/sendEmail",
      {
          method: "POST", 
          body: JSON.stringify({email, title, content}),
          headers: {
              "Content-Type": "application/json;charset=utf-8"
          }
      }).catch((e) => {
        console.log(e)
      })
    }
  }

  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { funnelName, funnelIds } = param
    const data = {funnelName, funnelIds}
    /* 判断参数是否合法 */
    if (param.funnelName) {
      let ret = await UserModel.createUser(data);
      let res = await UserModel.getUserDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res || {})
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await UserModel.getUserList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async hasSuperAdminAccount(ctx) {
    // 检查是否有管理员账号
    const adminData = await UserModel.checkAdminAccount();
    const adminUserCount = adminData[0].count * 1
  
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', adminUserCount)
  }

  /**
   * 验证Token是否存在
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async checkTokenExist(ctx) {
    // 检查是否有管理员账号
    const tokenData = await UserModel.checkTokenExist();
  
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', adminUserCount)
  }

  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserInfo(ctx) {
    let param = {}
    if (typeof ctx.request.body === "string") {
      param = JSON.parse(ctx.request.body)
    } else {
      param = ctx.request.body
    }
    const { userId } = param
    const res = await UserModel.getUserInfo(userId)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', res[0])
  }

  /**
   * 管理员获取用户列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserListByAdmin(ctx) {
    let req = ctx.request.body
    const { status } = req
    const { userType } = ctx.user
    if (userType !== "admin" && userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    if (req) {
      const data = await UserModel.getUserListByAdmin(status);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }

  /**
   * 获取所有用户列表，只返回userId, name
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getAllUserInfoForSimple(ctx) {
    const data = await UserModel.getAllUserInfoForSimple();
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await UserModel.getUserDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let params = JSON.parse(ctx.request.body)
    let id = params.id;
  
    if (id && !isNaN(id)) {
      await UserModel.deleteUser(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await UserModel.updateUser(id, req);
      let data = await UserModel.getUserDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
  
  static async setValidateCode() {
    const charArr = "0123456789ABCDEFGHGKLMNOPQRSTUVWXYZabcdefghigkmnopqrstuvwxyz"
    let code = ""
    for (let i = 0; i < 4; i ++) {
      const tempIndex = Math.floor(Math.random() * (charArr.length - 1) + 1)
      code += charArr.charAt(tempIndex)
    }
    const loginValidateCodeRes = await ConfigModel.getConfigByConfigName("loginValidateCode")
    if (loginValidateCodeRes && loginValidateCodeRes.length > 0) {
        await ConfigModel.updateConfig("loginValidateCode", {configValue: code})
    } else {
        await ConfigModel.createConfig({configName: "loginValidateCode", configValue: code})
    }
    return code
  }

  static async refreshValidateCode(ctx) {
    const code = await UserController.setValidateCode()
    if (global.monitorInfo.loginValidateCodeTimer) {
      clearInterval(global.monitorInfo.loginValidateCodeTimer)
    } else {
      global.monitorInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
      }, 5 * 60 * 1000)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', code)
  }

  static async getValidateCode(ctx) {
    const loginValidateCodeRes = await ConfigModel.getConfigByConfigName("loginValidateCode")
    if (loginValidateCodeRes && loginValidateCodeRes.length) {
      const code = loginValidateCodeRes[0].configValue
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', code)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', code)
    }
    
  }
  /**
   * 登录并创建token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { emailName, password, code } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    // const loginValidateCode = global.monitorInfo.loginValidateCode.toLowerCase()
    const loginValidateCodeRes = await ConfigModel.getConfigByConfigName("loginValidateCode")
    const loginValidateCode = loginValidateCodeRes[0].configValue.toLowerCase()
    const loginCode = code.toLowerCase()
    if (loginValidateCode != loginCode) {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确，请重新输入！', 1)
      return
    }

    // registerStatus = 1 代表激活状态
    const data = {emailName, password: Utils.md5(decodePwd)}
    const userData = await UserModel.getUserForPwd(data)
    if (userData) {
      const { userId, userType, registerStatus } = userData
      if (registerStatus === 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('此账号尚未激活，请联系管理员激活！', 1)
        return
      }
      const accessToken = jwt.sign({userId, userType, emailName}, secret.sign, {expiresIn: 33 * 24 * 60 * 60 * 1000})
      UserController.setValidateCode()

      // 生成好的token存入数据库，如果已存在userId，则更新
      const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
      if (userTokenInfo) {
        await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken})
      } else {
        await UserTokenModel.createUserToken({
          userId, accessToken
        })
      }

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('登录成功', accessToken)
    } else {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户名密码不正确！', 1)
    }
    
  }

  /**
   * 登录并创建token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async loginForApi(ctx) {
    const param = ctx.request.body
    const { emailName, password } = param
    const decodePwd = password

    // registerStatus = 1 代表激活状态
    const data = {emailName, password: Utils.md5(decodePwd)}
    const userData = await UserModel.getUserForPwd(data)
    if (userData) {
      const { userId, userType, registerStatus } = userData
      if (registerStatus === 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('此账号尚未激活，请联系管理员激活！', 1)
        return
      }
      const accessToken = jwt.sign({userId, userType, emailName}, secret.sign, {expiresIn: 33 * 24 * 60 * 60 * 1000})
      UserController.setValidateCode()

      // 生成好的token存入数据库，如果已存在userId，则更新
      const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
      if (userTokenInfo) {
        await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken})
      } else {
        await UserTokenModel.createUserToken({
          userId, accessToken
        })
      }

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('登录成功', accessToken)
    } else {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户名密码不正确！', 1)
    }
    
  }

  static async forgetPwd(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { email } = param
    // 判断是否为管理员
    let adminData = await UserModel.isAdminAccount(email, USER_INFO.USER_TYPE_ADMIN)
    if (adminData) {
      UserController.sendEmail(email, "密码找回", "管理员你好， 你的登录密码是：" + adminData.password)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('管理员你好，密码已发送至您的邮箱，请注意查收！', 0)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('非管理员账号，请联系管理员获取登录密码！', 1)
    }
  }
  

  /**
   * 发送注册验证码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async sendRegisterEmail(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { email } = param
    const charArr = "0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz"
    let code = ""
    for (let i = 0; i < 4; i ++) {
      const tempIndex = Math.floor(Math.random() * (charArr.length - 1) + 1)
      code += charArr.charAt(tempIndex)
    }
    if (global.monitorInfo.registerEmailCode[email]) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码发送太频繁', 1)
      return
    }
    global.monitorInfo.registerEmailCode[email] = code
    // 邮箱验证失败次数清零
    global.monitorInfo.registerEmailCodeCheckError[email] = 0
    // 1分钟后失效
    setTimeout(() => {
      delete global.monitorInfo.registerEmailCode[email]
    }, 2 * 60 * 1000)
    const title = "注册验证码：" + code
    const content = "<p>用户你好!</p>" + 
    "<p>Webfunny注册的验证码为：" + code + "</p>" +
    "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
    UserController.sendEmail(email, title, content)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('验证码已发送', 0)
  }
  /**
   * 获取注册验证码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getRegisterEmailForSupperAdmin(ctx) {
    const { userType } = ctx.user
    if (userType !== "superAdmin" && userType !== "admin") {
      ctx.response.status = 403;
      ctx.body = statusCode.ERROR_403('您没有权限执行此操作！')
      return
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', global.monitorInfo.registerEmailCode)
  }

  /**
   * 给管理员发送检查邮件
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerCheck(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, emailCode, password } = param
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }

    // 记录注册邮箱
    Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode}).catch((e) => {})

    let adminData = await UserModel.getAdminByType("admin")

    if (!adminData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('请先初始化管理员账号', 1)
    } else {
      const adminEmail = adminData.emailName
      const { localServerDomain } = accountInfo
      // 此处需要支持http协议
      const confirmUrl = `http://${localServerDomain}/server/register?name=${name}&email=${email}&password=${password}`
      const title = "管理员确认申请"
      const content = "<p>管理员你好!</p>" + 
      "<p>有用户申请注册你的监控系统，请点击注册链接，以完成注册：<a href='" + confirmUrl + "'>" + confirmUrl + "</a></p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
      UserController.sendEmail(adminEmail, title, content)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }
  }

  /**
   * 注册用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async register(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { name, email, phone, password, emailCode } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    const data = {nickname: name, emailName: email, phone, password: Utils.md5(decodePwd), userId, userType: "customer", registerStatus: 0, avatar}
    
    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }

    /* 判断参数是否合法 */
    if (data.nickname) {
      let ret = await UserModel.createUser(data);
      if (ret && ret.id) {
        // 通知用户注册的账号密码
        const title = "申请成功"
        const content = "<p>用户你好!</p>" + 
        "<p>你的账号已经申请成功，请联系管理员激活后，方可登录。</p>" +
        "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
        "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
        UserController.sendEmail(email, title, content)

        // 获取管理员账号
        const adminUser = await UserModel.getUserForAdmin()
        const contentArray = JSON.stringify([`您好，用户【${email}】正在申请注册webfunny账号，请及时处理！`])
        // 给管理员发送一条系统消息
        MessageModel.createMessage({
          userId: adminUser[0].userId,
          title: "用户注册通知",
          content: contentArray,
          type: "sys",
          isRead: 0,
          link: `http://${accountInfo.localAssetsDomain}/webfunny/teamList.html`
        })
        // 给管理员发送一封邮件
        const adminTitle = "用户注册通知"
        const adminContent = `
        <p>尊敬的管理员：</p>
        <p>您好，用户【${email}】正在申请注册webfunny账号，请及时处理！</p>
        <p>点击链接处理：http://${accountInfo.localAssetsDomain}/webfunny/userList.html</p>
        <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
        `
        UserController.sendEmail(adminUser[0].emailName, adminTitle, adminContent)

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }

  /**
   * 注册用户API
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerForApi(ctx) {
    const { name, email, phone, password } = ctx.request.body
    const decodePwd = password
    const userId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    const data = {nickname: name, emailName: email, phone, password: Utils.md5(decodePwd), userId, userType: "customer", registerStatus: 1, avatar}
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('邮箱已存在！', 1)
      return
    }

    /* 判断参数是否合法 */
    if (data.nickname && data.emailName && data.password) {
      let ret = await UserModel.createUser(data);
      if (ret && ret.id) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('账号注册成功', {userId})
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }

  /**
   * 重置密码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async resetPwd(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { email, password, emailCode } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const data = {emailName: email, password: Utils.md5(decodePwd), emailCode}

    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }

    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (!emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('此邮箱不存在！', 1)
      return
    }
    let ret = await UserModel.resetPwd(email, data);
    if (ret) {
      // 通知用户注册的账号密码
      const title = "密码重置成功！"
      const content = "<p>用户你好!</p>" + 
      "<p>你的webfunny密码已重置。</p>" +
      "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
      UserController.sendEmail(email, title, content)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('重置密码失败！', 1)
    }
  }
  /**
   * 注册管理员账号
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerForAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, password, userType, phone } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    const data = {nickname: name, emailName: email, password: Utils.md5(decodePwd), userType, userId, registerStatus: 1, phone, avatar}

    // 记录注册邮箱
    Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode}).catch((e) => {})

    /* 判断参数是否合法 */
    if (data.nickname) {
      const adminData = await UserModel.checkAdminAccount();
      const adminUserCount = adminData[0].count * 1
      if (adminUserCount > 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('超级管理员账号已存在，请勿重复创建', 1)
        return
      }
      await UserModel.createUser(data);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  /**
   * 激活注册用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async activeRegisterMember(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId, emailName } = param
    const { userType } = ctx.user
    if (userType !== "admin" && userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.activeRegisterMember(userId);

      MessageModel.createMessage({
        userId: userId,
        title: "欢迎登录！",
        content: JSON.stringify([
          "尊敬的用户您好，欢迎登录webfunny前端监控系统。",
          "webfunny致力于解决前端的各种问题，纯私有化部署，支持千万级PV的日活量。",
          "支持项目：H5前端、PC前端、微信小程序、uni-app。",
          "使用方法和常见问题请移步官网：www.webfunny.cn"
        ]),
        type: "sys",
        isRead: 0,
        link: `http://www.webfunny.cn`
      })
      // 给用户发送一封邮件
      const activeTitle = "用户激活通知"
      const activeContent = `
      <p>尊敬的用户：</p>
      <p>您好，您的账号已经被管理员激活了，快去登录吧！</p>
      <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
      `
      UserController.sendEmail(emailName, activeTitle, activeContent)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户已激活', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('激活失败')
    }
  }
  /**
   * 删除
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async deleteRegisterMember(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId } = param
    const { userType } = ctx.user
    if (userType !== "admin" && userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.deleteUserByUserId(userId);
      await UserTokenModel.deleteUserToken(userId)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户信息删除成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }

  /**
   * 将成员设置为管理员
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async setAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId, setType } = param
    const { userType } = ctx.user
    if (userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非超级管理员，无权设置管理员！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.setAdmin(userId, setType);
      await UserTokenModel.deleteUserToken(userId)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('管理员设置成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }

  /**
   * 将成员设置为管理员
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async resetSuperAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const targetUserId = param.userId
    const { userType, userId } = ctx.user
    if (userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非超级管理员，无权设置管理员！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.resetSuperAdmin(userId, targetUserId);
      await UserTokenModel.deleteUserToken(userId)
      await UserTokenModel.deleteUserToken(targetUserId)
      // 让数据库里的token失效

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('超级管理员移交成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }

  /**
   * 检查token是否有效
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async checkSsoToken(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { token } = param

    // 判断库里是否有这个token
    const userTokenDetail = await UserTokenModel.getUserTokenDetailByToken(token)
    if (!userTokenDetail) {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412("Token无效或已过期！");
        return
    }
    // 第二步，判断token是否合法
    await jwt.verify(token, secret.sign, async (err) => {
      if (err) {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412("Token无效或已过期！");
        return
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('Token验证通过！', 0)
    })
  }
}
//exports//
module.exports = UserController
//exports//