import { isFn, difference } from "./utils";
import { INTERNAL_GET_STATE, INTERNAL_SET_STATE } from "./constants";

export default function makeEnhancers(report) {
  return {
    wiredAction: function(namespace, action) {
      if (namespace.length > 1) {
        var parentNamespace = namespace.slice(0, namespace.length - 1);
        report(
          "Still using nested action with namespace: '" +
            parentNamespace.join(".") +
            "'. You need to flatten your tree of actions"
        );
      }
      return function(data) {
        return function(state, actions) {
          var result;
          if (namespace[0] === INTERNAL_GET_STATE) {
            result = state;
          } else if (namespace[0] === INTERNAL_SET_STATE) {
            result = data;
          } else {
            report("Still using wired action: '" + namespace.join(".") + "'");
            result = action(data);
          }
          result = isFn(result) ? result(state, actions) : result;
          var omittedStateKeys = difference(
            Object.keys(state),
            Object.keys(result || {})
          );
          if (omittedStateKeys.length) {
            report(
              "New state will no longer be shallow-merged with existing state. The following state keys were ommited: '" +
                omittedStateKeys.join(", ") +
                "'"
            );
          }
          return result;
        };
      };
    },
    interopAction: function(namespace, action) {
      return function(data) {
        report(
          "Still calling action: '" + namespace.join(".") + "' for interop"
        );
        return action(data);
      };
    }
  };
}
