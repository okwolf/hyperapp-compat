import { LIFECYLCE_METHODS } from "./constants";
import { isFn, flatten } from "./utils";
import patchSub from "./patchSub";

function makeEnhancedSubview(report, dispatch, view) {
  function patchVdom(state, actions, vdom) {
    if (typeof vdom === "object" && vdom !== null) {
      for (var key in vdom.attributes) {
        var isLifecycle = LIFECYLCE_METHODS.some(function(lifecyleName) {
          var matches = lifecyleName === key;
          if (matches) {
            report(
              "Still using lifecycle method: '" +
                lifecyleName +
                "'. Please remove it."
            );
          }
          return matches;
        });
        if (key[0] === "o" && key[1] === "n" && !isLifecycle) {
          var originalAction = vdom.attributes[key];
          vdom.attributes[key] = function(currentEvent) {
            dispatch(originalAction, currentEvent);
          };
        }
      }
      for (var i in vdom.children) {
        if (isFn(vdom.children[i])) {
          report("Still using lazy components/subviews");
          vdom.children[i] = makeEnhancedSubview(
            report,
            dispatch,
            vdom.children[i]
          );
        } else {
          patchVdom(state, actions, vdom.children[i]);
        }
      }
    }
  }
  return function(state, actions) {
    var vdom = view(state, actions);
    patchVdom(state, actions, vdom);
    return vdom;
  };
}

export default function makeEnhancedView(
  report,
  dispatch,
  view,
  subscriptions
) {
  var rootView = makeEnhancedSubview(report, dispatch, view);
  var currentSubscriptions = [];
  return function(state, actions) {
    if (subscriptions) {
      currentSubscriptions = patchSub(
        currentSubscriptions,
        flatten(subscriptions(state)),
        dispatch
      );
    }
    return rootView(state, actions);
  };
}
