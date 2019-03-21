import { isArray, isFn, assign } from "./utils";

function isSameAction(a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && isFn(a[0]);
}

function shouldRestart(a, b) {
  for (var k in assign(a, b)) {
    if (a[k] === b[k] || isSameAction(a[k], b[k])) b[k] = a[k];
    else return true;
  }
}

export default function patchSub(sub, newSub, dispatch) {
  for (var i = 0, a, b, out = []; i < sub.length || i < newSub.length; i++) {
    a = sub[i];
    b = newSub[i];
    out.push(
      b
        ? !a || b[0] !== a[0] || shouldRestart(b[1], a[1])
          ? [b[0], b[1], b[0](b[1], dispatch), a && a[2]()]
          : a
        : a && a[2]()
    );
  }
  return out;
}
