const sequelizeTemp = require('./local_db')
const Sequelize = require('sequelize');
let db = null
let dbNext = null
if (sequelizeTemp) {
  db = sequelizeTemp.sequelize
  dbNext = sequelizeTemp.sequelizeNext
} else {
  const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'ip',
    dialect: 'mysql',
    // operatorsAliases: false,
    dialectOptions: {
      charset: "utf8mb4",
      supportBigNumbers: true,
      bigNumberStrings: true
    },

    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00' //东八时区
  });

  db = sequelize

}
module.exports = {
  sequelize: dbNext,
  sequelizeNext: dbNext
}
