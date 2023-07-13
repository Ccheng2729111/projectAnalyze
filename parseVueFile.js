
const fs = require('fs')
const { consola } = require('consola')
const compiler = require('vue-template-compiler')


function parseVueFile(filePath, matchString) {
    return new Promise((res, rej) => {
        fs.readFile(filePath, 'utf-8', function (err, data) {
            if (err) {
                consola.error('> 文件读取错误')
                return
            }
            const result = parseValue(data, matchString)
            res(result)
        })
    })
}



// 解析code 根据parseComponent解析出的script，template计算出表单数量
// 以及根据传入的string匹配template中的字符串 统计次数
// res { scriptLength, templateLength, matchCount }
function parseValue(code, matchString) {
    const res = {}
    const sfc = compiler.parseComponent(code)
    if (sfc.script) {
        res.scriptLength = sfc.script.end - sfc.script.start
    }
    if (sfc.template) {
        res.templateLength = sfc.template.end - sfc.template.start
        res.matchCount = matchArrayString(sfc.template.content, matchString)
    }

    return res
}

// 根据传入的arr 轮训匹配template中的字符串 返回匹配结果对象
function matchArrayString(content, matchString) {
    const matchRes = matchString.map(s => ({
        matchKey: s,
        count: matchStringCount(s, content)
    }))

    return matchRes
}

// 根据传入的string匹配template中的字符串
function matchStringCount(templateStr, templateCode) {
    const regex = new RegExp(`<${templateStr}[^>-]*(?!-)`, 'gi')
    let matchCount = 0

    while (regex.exec(templateCode) !== null) {
        matchCount++
    }

    return matchCount
}
module.exports = parseVueFile


// parseVueFile('./index.vue', ['el-form', 'el-table', 'BaseTable'])
