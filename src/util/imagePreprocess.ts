const tf = require('@tensorflow/tfjs-node')

export const preprocess = (imgData: any) => {
  return tf.tidy(() => {
    const offset = tf.scalar(255.0);
    const normalized = imgData.div(offset);
    const batched = normalized.expandDims(0)
    return [batched]
 })
}
