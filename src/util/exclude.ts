export const exclude = (object: Object, keys: PropertyKey[]): Object => {
  return Object.keys(object).reduce((obj: Object, key) => {
    if (object && !keys.includes(key)) {
      // @ts-ignore
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default exclude
