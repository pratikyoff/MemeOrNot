import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-node'
import * as path from 'path'
import * as fs from 'fs'
import ImageStore from './image-cache';

require('dotenv').load()

class Ml {
    constructor() {
        this.compileModel()
        let imgStore = new ImageStore()
        const filePath = imgStore.getImageCanvasFromUrl('https://image.freepik.com/free-icon/jpg-file-format-variant_318-45505.jpg')
        filePath.then(image => {
            tf.fromPixels(image).print()
        })
    }

    async compileModel() {
        let modelJsonPath = path.join(process.env.HOME, process.env.ML_DATA_DIRECTORY, 'mySavedModel', 'model.json')

        if (fs.existsSync(modelJsonPath)) {
            this.model = await tf.loadModel('file://' + modelJsonPath)
        }
        else {
            this.model = tf.sequential()

            this.model.add(tf.layers.dense({
                inputShape: [3],
                units: 3,
                activation: 'tanh'
            }))

            this.model.add(tf.layers.dense({
                units: 3,
                activation: 'tanh'
            }))

            this.model.add(tf.layers.dense({
                units: 3,
                activation: 'tanh'
            }))
        }

        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        })
    }

    startTraining() {
        const [xs, ys] = this.getTrainingData()

        this.model.fit(xs, ys, {
            batchSize: 1,
            epochs: 5000,
        }).then(history => {
            this.model.save('file://' + path.join(process.env.HOME, process.env.ML_DATA_DIRECTORY, 'mySavedModel')).then(res => {
                console.log('model saved')
            })
        })
    }

    getTrainingData() {
        let xTensor = tf.tensor2d([[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1]])
        let yTensor = tf.tensor2d([[0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1], [0, 0, 0]])
        return [xTensor, yTensor]
    }

    async getPrediction() {
        const [xs, ys] = this.getTrainingData()

        let results = this.model.predict(xs)

        return tf.round(results)
    }
}

export default Ml