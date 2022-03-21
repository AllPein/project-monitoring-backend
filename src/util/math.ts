export const normalize: any = (data: number[]) => {
  const sqrt = findDistance(data)
  return data.map((el: number) => el / sqrt)
}

const findDistance = (data: number[]) => {
  return Math.sqrt(data.reduce((acc: number, el: number) => acc += el * el, 0))
}

export const findEuclidianDistance = (sourceRepresentation: bigint[], actualData: bigint[]) => {
  const euclidianDisntances = sourceRepresentation.reduce((acc, el, i) => {
    acc[i] = el - actualData[i]
    return acc
  }, [])
  return findDistance(euclidianDisntances)
}
