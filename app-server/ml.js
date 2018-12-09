import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-node'

class Ml {
    constructor() {
        this.compileModel()
        this.startTraining()
    }

    compileModel = () => {
        this.model = tf.sequential()

        this.model.add(tf.layers.dense({
            inputShape: [3],
            units: 10,
            activation: 'sigmoid'
        }))

        this.model.add(tf.layers.dense({
            units: 3,
            activation: 'sigmoid'
        }))

        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        })
    }

    startTraining = () => {
        const [xs, ys] = this.getTrainingData()

        // let loss = 1
        // while (loss > 0.1) {
        this.model.fit(xs, ys, {
            batchSize: 1,
            epochs: 4,
        }).then(history => {
            this.model.save('file:///./tmp/mySavedModel')
            if (history.history.loss[3999] > 0.1) {
                // this.startTraining()
            }
        })
        // a.then(history => {
        //     let lossArr = history.history.loss
        //     loss = lossArr[lossArr.length - 1]
        // })
        // }
    }

    getTrainingData = () => {
        let xTensor = tf.tensor2d([[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1]])
        let yTensor = tf.tensor2d([[0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1], [0, 0, 0]])
        return [xTensor, yTensor]
    }

    getPrediction = async () => {
        const [xs, ys] = this.getTrainingData()

        let results = this.model.predict(xs)

        return results
    }
}

export default Ml