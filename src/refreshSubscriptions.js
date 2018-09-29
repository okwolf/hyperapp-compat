import { isArray, assign, isSameValue } from "./utils";

function isSameAction(a, b) {
  return (
    typeof a === typeof b &&
    (isArray(a) && a[0] === b[0] && isSameValue(a[1], b[1]))
  );
}

function start(sub, dispatch) {
  return assign(sub, {
    cancel: sub.effect(sub, dispatch)
  });
}

function restart(sub, oldSub, dispatch) {
  for (var k in assign(sub, oldSub)) {
    if (
      k !== "cancel" &&
      sub[k] !== oldSub[k] &&
      !isSameAction(sub[k], oldSub[k])
    ) {
      oldSub.cancel();
      return start(sub, dispatch);
    }
  }
  return oldSub;
}

export default function refreshSubscriptions(sub, oldSub, dispatch) {
  if (isArray(sub) || isArray(oldSub)) {
    var out = [];
    var subs = isArray(sub) ? sub : [sub];
    var oldSubs = isArray(oldSub) ? oldSub : [oldSub];

    for (var i = 0; i < subs.length || i < oldSubs.length; i++) {
      out.push(refreshSubscriptions(subs[i], oldSubs[i], dispatch));
    }

    return out;
  }

  return sub
    ? oldSub
      ? restart(sub, oldSub, dispatch)
      : start(sub, dispatch)
    : oldSub
      ? oldSub.cancel()
      : oldSub;
}
