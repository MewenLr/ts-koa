export default {
  objByKey: (obj: object, filter: Array<string>):
    object => filter.reduce((res, key) => ({ ...res, [key]: obj[key] }), {}),
}
