const readFilesInDirectory = require('./readDirFiles')
const parseVueFile = require('./parseVueFile')
const fs = require('fs')

async function deelWithFiles(path, matchStrings) {
    const allVueFiles = readFilesInDirectory(path)
    const writeObject = {}

    for (const [key, value] of allVueFiles) {
        const res = await parseVueFile(key, matchStrings)
        writeObject[key] = { ...res, filename: value }
    }

    fs.writeFile('./result.json', JSON.stringify(writeObject), function (err) { })
}

deelWithFiles('../', ['el-form', 'el-table', 'BaseTable'])
