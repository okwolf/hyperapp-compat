// special action names used for getting and setting state from dispatch
// inspired by https://github.com/reduxjs/redux/blob/3b600993e91d42d1569994964e9a13606edccdf0/src/utils/actionTypes.js#L9-L14
export var INTERNAL_GET_STATE =
  "@@compat/GET_STATE" +
  Math.random()
    .toString(36)
    .substring(7)
    .split("")
    .join(".");

export var INTERNAL_SET_STATE =
  "@@compat/SET_STATE" +
  Math.random()
    .toString(36)
    .substring(7)
    .split("")
    .join(".");

export var REFACTOR_FOR_V2 =
  ". You need to refactor this before moving to Hyperapp 2.0.";

export var LIFECYLCE_METHODS = [
  "onCreate",
  "onUpdate",
  "onRemove",
  "onDestroy"
];
