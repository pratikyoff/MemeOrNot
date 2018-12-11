import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-node'
import * as fs from "fs";
import * as util from './utils'
import ImageStore from "./image-store";

class MlImage {
    constructor() {
        this.initializeDirectories()
        this.compileModel()
        this.constants = {
            learningRate: 0.1
        }
        this.imageStore = new ImageStore()
    }

    /**
     *@param {string} imageUrl
     *@param {boolean} [isAMeme=true]
     *
     */
    async trainWithUrl(imageUrl, isAMeme) {
        if (!imageUrl)
            throw new Error('imageUrl is empty')
        const canvas = await this.imageStore.getImageCanvasFromUrl()
        const image = tf.fromPixels(canvas)
        const resized = tf.image.resizeBilinear(image, [200, 200])

        this.model.fit()
    }

    initializeDirectories() {
        this.dataDirPath = path.join(process.env.HOME, process.env.ML_DATA_DIRECTORY);
        this.SaveDataFolderPath = path.join(this.dataDirPath, 'mlImage');
        util.createDirectoryIfNotExist(this.dataDirPath);
        util.createDirectoryIfNotExist(this.SaveDataFolderPath);
    }

    async compileModel() {
        let modelJsonPath = path.join(this.SaveDataFolderPath, 'model.json')

        if (fs.existsSync(modelJsonPath)) {
            this.model = await tf.loadModel('file://' + modelJsonPath)
        }
        else {
            this.model = tf.sequential()

            this.model.add(tf.layers.conv2d({
                activation: 'relu',
                inputShape: [200, 200, 3],
                kernelSize: 5,
                strides: 1,
                filters: 10,
                kernelInitializer: 'VarianceScaling'
            }))

            this.model.add(tf.layers.maxPooling2d({
                poolSize: [2, 2],
                strides: [2, 2]
            }))

            this.model.add(tf.layers.flatten())

            this.model.add(tf.layers.dense({
                units: 10,
                activation: 'tanh'
            }))

            this.model.add(tf.layers.dense({
                units: 2,
                activation: 'softmax'
            }))
        }

        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: tf.train.sgd(this.constants.learningRate)
        })
    }
}

export default MlImage