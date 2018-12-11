import * as path from 'path'
import * as download from 'image-downloader'
import { loadImage, createCanvas } from 'canvas';
import * as kvStore from 'node-persist'
import * as util from './utils'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-node'

class ImageStore {
    constructor() {
        this.initializeDirectories();
        kvStore.init({
            dir: path.join(process.env.HOME, process.env.ML_DATA_DIRECTORY, process.env.RESULT_DATA_DIRECTORY),
            ttl: false,
            logging: console.log,
            encoding: 'utf8',
        })
    }

    initializeDirectories() {
        this.dataDirPath = path.join(process.env.HOME, process.env.ML_DATA_DIRECTORY);
        this.downloadedImagesFolder = path.join(this.dataDirPath, process.env.ORIGINAL_IMAGE_FOLDER);
        this.correctedImagesFolder = path.join(this.dataDirPath, process.env.COMPRESSED_IMAGE_FOLDER);
        util.createDirectoryIfNotExist(this.dataDirPath);
        util.createDirectoryIfNotExist(this.downloadedImagesFolder);
        util.createDirectoryIfNotExist(this.correctedImagesFolder);
    }

    /**
     * Get image as canvas from a url
     * @param {string} imgUrl
     */
    async getImageCanvasFromUrl(imgUrl) {
        const { filename } = await download.image({
            url: imgUrl,
            dest: this.downloadedImagesFolder
        })

        const canvas = await this.getCanvasFromImagePath(filename);

        return canvas
    }

    async saveImageFromTensor(imageTensor) {
        const imgSavePath = path.join(this.dataDirPath, 'producedImages')
        const canvas = await tf.toPixels(imageTensor)
    }

    /**
     * Creates a canvas object from an image
     * @param {string} filepath
     */
    async getCanvasFromImagePath(filepath) {
        const image = await loadImage(filepath);
        const canvas = createCanvas(image.width, image.height);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        return canvas;
    }

    /**
     * Get compressed and adjusted image as canvas
     * @param {string} imageName Filename of the image
     * @returns Canvas
     */
    async getCorrectedImage(imageName) {
        const filepath = path.join(this.correctedImagesFolder, imageName)
        return await this.getCanvasFromImagePath(filepath)
    }

    /**
     * Get untouched downloaded image as canvas
     * @param {string} imageName Filename of the image
     */
    async getDownloadedImage(imageName) {
        const filepath = path.join(this.downloadedImagesFolder, imageName)
        return await this.getCanvasFromImagePath(filepath)
    }

    /**
     * Set whether an image is a meme or not
     * @param {string} filename
     * @param {boolean} isMeme
     */
    identifyImage(filename, isMeme) {
        kvStore.setItemSync(filename, isMeme)
    }

    /**
     * @param {string} filename
     */
    isImageAMeme(filename) {
        return kvStore.getItemSync(filename)
    }
}

export default ImageStore