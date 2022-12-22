var fs = require('fs');
const utils = require("../util/utils")
var argv = process.argv
var start = 0
var end = argv[2]

// 创建api_wiki目录
fs.mkdir( __dirname + "/api_wiki", async (err) => {
  if ( err ) { 
    console.log(`= 文件夹 ${__dirname}/api_wiki 已经存在`)
    return
  }
  console.log(`= 创建文件夹 ${__dirname}/api_wiki`)
});
// 删除原来的文件
let oldFilePath = '/Users/jeffery/MonitorProjects/webfunny_manage/routes/api_wiki';
let oldFiles = fs.readdirSync(oldFilePath);
oldFiles.forEach(function(fileName) {
    // fs.unlink(oldFilePath + "/" + fileName,() => {
    //     console.log("成功删除文件 " + fileName)
    // });
    fs.rmdir(oldFilePath + "/" + fileName,() => {
        console.log("成功删除目录 " + fileName)
    });
})
return
// 读取api目录
let currentFilePath = '/Users/jeffery/MonitorProjects/webfunny_manage/routes/api';
let currentFiles = fs.readdirSync(currentFilePath);
for(let i = 0; i < currentFiles.length; i++){
  const apis = require(`./api/${currentFiles[i]}`)
  const dirName = currentFiles[i].replace(".js", "")
  fs.mkdir( __dirname + "/api_wiki/" + dirName, async (err) => {
    if ( err ) { 
      console.log(`= 文件夹 ${__dirname}/api_wiki/${dirName} 已经存在`)
    } else {
      console.log(`= 创建文件夹 ${__dirname}/api_wiki/${dirName}`)
    }
    
    for (let i = 0; i < apis.length; i ++) {
      let apiConfig = apis[i]
      console.log(handleApiConfig(apiConfig))
    }
    
  });

}

const handleApiConfig = (apiConfig) => {
  const {
    title, author, creatTime, des,
    url, method, params, 
    correctResultExample, incorrectResultExample,
    ps, logs
  } = apiConfig
  // 接口标题
  let titleTemp = `# ${title}
  >维护人员：**${author}**  
  >创建时间：${creatTime}

  ## 接口简介
  ${des}

  `
  // 接口详情
  let detailTemp = `## 接口详情

  ### 请求地址
  ${url}

  ### 请求类型
  ${method}

  ### 请求参数
  | 参数名 | 类型 | 必填 | 描述 | 默认值 | 参考值 |
  | --- | :---: | :---: | --- | --- | --- |
  `
  params.forEach((item) => {
    let paramLine = `| ${item.name} | ${item.type} | ${item.isRequired} | ${item.des} | ${item.defaultValue} | ${item.example} |
    `
    detailTemp += paramLine
  })

  // 正确的返回示例
  const { code, msg, data, dataDes } = correctResultExample
  let correctResultExampleTemp = `
  ### 返回正确JSON示例
  \`\`\`javascript
  {
    "code": ${code}
    "msg": ${msg}
    "data": {
  `
  for (let key in data) {
    correctResultExampleTemp +=`
      "${key}": "${data[key]}", // ${dataDes[key]}
    `
  }
  correctResultExampleTemp += `
    }
  }
  \`\`\`
  `
  let incorrectResultExampleTemp = `
  ### 返回错误JSON示例
  \`\`\`javascript
  无
  \`\`\`
  `

  // 备注
  let psTemp = `
  ### 备注说明
  ${ps}
  `

  // 修改日志
  let logsTemp = `
  ### 修改日志
  `
  logs.forEach((item) => {
    logsTemp += `
  - 【${item.date}】  
    ${item.des}
  `
  })
  return titleTemp + detailTemp + correctResultExampleTemp + incorrectResultExampleTemp + psTemp + logsTemp
}


