const fs = require('fs');
const path = require('path');
const { consola } = require('consola')

const allFilesMap = new Map()

// 遍历文件夹并读取文件（跳过隐藏文件）
function readFilesInDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStat = fs.lstatSync(filePath);

        // 跳过隐藏文件和文件夹
        if (!file.startsWith('.')) {
            if (fileStat.isFile()) {
                const fileName = getFileNameByRePath(filePath)
                const absolute = getAbsoluteByRePath(filePath)
                if (getExtNameByRePath(filePath) === '.vue') {
                    allFilesMap.set(absolute, fileName)
                }
                // 进行文件读取操作
            } else if (fileStat.isDirectory() && !isNodeModule(filePath)) {
                // 递归读取子文件夹中的文件
                readFilesInDirectory(filePath);
            }
        }
    }

    return allFilesMap
}

function getAbsoluteByRePath(relativePath) {
    return path.resolve(__dirname, relativePath)
}


function getFileNameByRePath(relativePath) {
    return path.basename(relativePath)
}

function getExtNameByRePath(relativePath) {
    return path.parse(relativePath).ext
}

function isNodeModule(relativePath) {
    const regex = /\/node_modules\//
    return regex.test(relativePath)
}

module.exports = readFilesInDirectory

// 示例：读取当前目录下的文件
// readFilesInDirectory('../');



// console.log(allFilesMap)
