import { isArray, assign, isSameValue } from "./utils";

function isSameAction(a, b) {
  return (
    typeof a === typeof b &&
    (isArray(a) && a[0] === b[0] && isSameValue(a[1], b[1]))
  );
}

function start(sub, dispatch) {
  return [sub[0], sub[1], sub[0](sub[1], dispatch)];
}

function cancel(sub) {
  sub[2]();
}

var restart = function(sub, oldSub, dispatch) {
  for (var k in assign(sub, oldSub)) {
    if (sub[k] !== oldSub[k] && !isSameAction(sub[k], oldSub[k])) {
      cancel(oldSub);
      return start(sub, dispatch);
    }
  }
  return oldSub;
};

export default function refreshSubscriptions(sub, oldSub, dispatch) {
  var current = [].concat(sub);
  var previous = [].concat(oldSub);
  var out = [];

  for (var i = 0; i < current.length || i < previous.length; i++) {
    var cSub = current[i];
    var pSub = previous[i];
    out.push(
      cSub
        ? pSub
          ? restart(cSub, pSub, dispatch)
          : start(cSub, dispatch)
        : pSub
          ? cancel(pSub)
          : pSub
    );
  }

  return out;
}
