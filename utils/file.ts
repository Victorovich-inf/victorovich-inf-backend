import { unlink } from 'fs/promises'
import { join } from 'path'

const fileDir = join(__dirname, '..')

export const getFilePath = (filePath: any) => join(fileDir, filePath)

export const removeFile = async (filePath: any) => {
    try {
        await unlink(join(fileDir, filePath))
    } catch (e) {
        console.log('error', e)
    }
}