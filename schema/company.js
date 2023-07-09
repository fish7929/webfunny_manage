//delete//
const moment = require('moment');
//delete//
const Project = function (sequelize, DataTypes) {
  return sequelize.define('Company', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司名称
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'companyName'
    },
    // 公司团队列表
    teamIds: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'teamIds'
    },
    // 公司负责人
    ownerId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'ownerId'
    },
    // 税号
    taxNumber: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'taxNumber'
    },
    // 企业地址
    companyAddress: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'companyAddress'
    },
    // 企业电话
    companyPhone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'companyPhone'
    },
    // 开户银行
    bankName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'bankName'
    },
    // 银行卡号
    bankNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'bankNumber'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  })

}
//exports//
module.exports = Project
//exports//