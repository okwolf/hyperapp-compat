export function isFn(value) {
  return typeof value === "function";
}

export var isArray = Array.isArray;

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

export function isSameValue(a, b) {
  if (a !== b) {
    for (var k in assign(a, b)) {
      if (a[k] !== b[k]) return false;
    }
  }
  return true;
}
