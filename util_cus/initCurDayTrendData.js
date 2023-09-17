/**
 * 初始化当前24小时流量趋势数据
 * @param initData 初始数据
 */
const DateTimeArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
const initCurDayTrendData = (initData, keyName) => {
    const curDate = new Date().Format("yyyy-MM-dd")
    return DateTimeArr.map(item => {
        return { ...initData, [keyName]: `${curDate} ${item}` }
    })
}
module.exports = initCurDayTrendData