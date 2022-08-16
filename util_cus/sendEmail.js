const nodemailer = require('nodemailer')
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
/**
 * 自己配置邮箱：在 bin/useCusEmailSys.js文件中 参数改为true，并配置自己的163邮箱和密码
 * @param targetEmail 目标邮箱地址
 * @param emailTitle 邮件标题
 * @param emailContent 邮件正文
 * @param user 系统邮箱地址（不传参，则默认使用配置的邮箱地址）
 * @param pass 系统邮箱密码（不传参，则默认使用配置的邮箱密码）
 */
const sendEmail = (targetEmail, emailTitle, emailContent, user = accountInfo.emailUser, pass = accountInfo.emailPassword) => {
    const company = "webfunny"
    let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { user,pass }
    });
    // send mail with defined transport object
    transporter.sendMail({
        from: "'" + company + "' <" + user + ">", // sender address
        to: targetEmail, // list of receivers
        subject: emailTitle, // Subject line
        text: emailContent, // plain text body
        html: emailContent // html body
    });
}
module.exports = sendEmail