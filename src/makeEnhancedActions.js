import { isFn } from "./utils";

export default function makeEnhancedActions(
  enhancer,
  actionsTemplate,
  prefixes
) {
  return Object.keys(actionsTemplate || {}).reduce(function(
    otherActions,
    name
  ) {
    var namespace = (prefixes ? prefixes : []).concat(name);
    var action = actionsTemplate[name];
    otherActions[name] = isFn(action)
      ? enhancer(namespace, action)
      : makeEnhancedActions(enhancer, action, namespace);
    return otherActions;
  },
  {});
}
