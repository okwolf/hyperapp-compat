import { LIFECYLCE_METHODS } from "./constants";
import { isFn } from "./utils";

export default function makeEnhancedView(report, dispatch, view) {
  function patchVdom(state, actions, vdom) {
    if (typeof vdom === "object" && vdom !== null) {
      for (var key in vdom.attributes) {
        var isLifecycle = LIFECYLCE_METHODS.some(function(lifecyleName) {
          var matchesExact = lifecyleName === key;
          var matchesCaseInsensitive =
            lifecyleName.toLowerCase() === key.toLowerCase();
          if (matchesCaseInsensitive && !matchesExact) {
            report(
              "Still using old lifecycle method: '" +
                key +
                "'. Please switch to: '" +
                lifecyleName +
                "'"
            );
          }
          return matchesCaseInsensitive;
        });
        if (key[0] === "o" && key[1] === "n" && !isLifecycle) {
          var originalAction = vdom.attributes[key];
          vdom.attributes[key] = function(currentEvent) {
            dispatch(originalAction, currentEvent);
          };
          if (key !== key.toLowerCase()) {
            vdom.attributes[key.toLowerCase()] = vdom.attributes[key];
            delete vdom.attributes[key];
          }
        }
      }
      for (var i in vdom.children) {
        if (isFn(vdom.children[i])) {
          report("Still using lazy components/subviews");
          vdom.children[i] = makeEnhancedView(
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
