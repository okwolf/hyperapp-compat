export function isFn(value) {
  return typeof value === "function";
}

export function assign(source, assignments) {
  var result = {},
    i;
  for (i in source) result[i] = source[i];
  for (i in assignments) result[i] = assignments[i];
  return result;
}

export function omit(object, keys) {
  var copy = {};
  Object.keys(object)
    .filter(function(key) {
      return keys.indexOf(key) === -1;
    })
    .forEach(function(key) {
      copy[key] = object[key];
    });
  return copy;
}

export function difference(source, exclude) {
  return source.filter(function(currentValue) {
    return exclude.indexOf(currentValue) === -1;
  });
}
