const { DataTypes } = require("sequelize");

const FlowDataInfoSchema = require('./flowDataInfo')
const FlowDataInfoConfig = FlowDataInfoSchema(DataTypes)

const schemaList = [
    {
        name: "FlowDataInfo",
        fields: FlowDataInfoConfig.fields,
        index: FlowDataInfoConfig.fieldIndex
    },
]

module.exports = schemaList