export const pick = (object: Object, keys: PropertyKey[]): Object => {
  return keys.reduce((obj: Object, key) => {
    if (object && object.hasOwnProperty(key)) {
      // @ts-ignore
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick
