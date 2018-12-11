import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-node'
import * as fs from "fs";

class MlImage {
    constructor() {
        if (fs.existsSync('/tmp/ml-image-engine-save')) {
            this.model = tf.loadModel()
        }
    }

    /**
     *@param {string} imageUrl
     *@param {boolean} [isAMeme=true]
     *
     */
    trainWithUrl(imageUrl, isAMeme) {
        if (!imageUrl)
            throw new Error('imageUrl is empty')


    }
}

export default MlImage