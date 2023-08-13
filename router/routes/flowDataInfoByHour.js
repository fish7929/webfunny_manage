const FlowDataInfoByHourController = require('../../controllers/flowDataInfoByHour')

module.exports = (router) => {
    // 存储流量信息
    router.post('/createFlowData', FlowDataInfoByHourController.createFlowDataInfoByHour);
    // 获取流量列表数据
    router.get('/getHourFlowTrendData', FlowDataInfoByHourController.getHourFlowTrendData);
}
