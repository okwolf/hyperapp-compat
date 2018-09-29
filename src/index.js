import {
  INTERNAL_GET_STATE,
  INTERNAL_SET_STATE,
  REFACTOR_FOR_V2
} from "./constants";
import makeEnhancedActions from "./makeEnhancedActions";
import makeEnhancers from "./makeEnhancers";
import makeEnhancedView from "./makeEnhancedView";
import { isFn, isArray, assign } from "./utils";

export default function withCompat(nextApp) {
  return function(propsOrState) {
    var props = {};
    var usingV1Args = arguments.length > 1;
    var reportedMessages = {};
    function report(message) {
      if (!reportedMessages[message]) {
        reportedMessages[message] = true;
        var completeMessage = message + REFACTOR_FOR_V2;
        if (!usingV1Args && props.strictMode) {
          throw new Error(completeMessage);
        } else {
          // eslint-disable-next-line no-console
          console.warn(completeMessage);
        }
      }
    }
    if (usingV1Args) {
      report(
        "Still using positional arguments to app(), please upgrade to props object"
      );
      props.state = arguments[0];
      props.actions = arguments[1];
      props.view = arguments[2];
      props.container = arguments[3];
    } else {
      props = assign(propsOrState);
      if (props.state) {
        report("Please upgrade from using state argument to init");
      }
      if (props.actions) {
        report("Please upgrade from wired actions to v2 actions");
      }
    }

    var enhancers = makeEnhancers(report);
    props.actions = props.actions || {};
    props.actions[INTERNAL_GET_STATE] = Function.prototype;
    props.actions[INTERNAL_SET_STATE] = Function.prototype;

    var wiredActions;
    function dispatch(obj, data) {
      var state = wiredActions[INTERNAL_GET_STATE]();
      function setState(nextState) {
        wiredActions[INTERNAL_SET_STATE](nextState);
      }
      if (obj == null) {
        // ignore
      } else if (isFn(obj)) {
        dispatch(obj(state, data));
      } else if (isArray(obj)) {
        if (isFn(obj[0])) {
          dispatch(obj[0](state, obj[1], data));
        } else {
          obj[1].effect(obj[1], dispatch, setState(obj[0]));
        }
      } else {
        setState(obj);
      }
    }

    var enhancedActions = makeEnhancedActions(
      enhancers.wiredAction,
      props.actions
    );
    var enhancedView = makeEnhancedView(
      report,
      dispatch,
      props.view,
      props.subscriptions
    );
    var container = props.container;
    wiredActions = nextApp(
      props.state,
      enhancedActions,
      enhancedView,
      container
    );

    if (props.init) {
      dispatch(props.init);
    }

    var appActions = makeEnhancedActions(enhancers.interopAction, wiredActions);
    delete appActions[INTERNAL_SET_STATE];
    return appActions;
  };
}
