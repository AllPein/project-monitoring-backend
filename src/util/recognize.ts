import { preprocess } from "./imagePreprocess"
import { normalize } from "./math"
const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')

export const recognize: any = async (imageUrl: any) => {
  const model = await tf.loadLayersModel('file://recjs/model.json')
  const image = fs.readFileSync(imageUrl)
  const tensor = tf.node.decodeImage(image, 3)
  const preprocessedImage = preprocess(tensor)
  const output = model.predict(preprocessedImage).dataSync()
  return normalize(output[0])
}
