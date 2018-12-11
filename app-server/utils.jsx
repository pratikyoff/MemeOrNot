import * as fs from 'fs'

export function createDirectoryIfNotExist(dataDirPath) {
    if (!fs.existsSync(dataDirPath))
        fs.mkdirSync(dataDirPath);
}