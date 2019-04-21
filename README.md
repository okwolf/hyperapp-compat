# Hyperapp Compat

[![Build Status](https://travis-ci.org/okwolf/hyperapp-compat.svg?branch=master)](https://travis-ci.org/okwolf/hyperapp-compat)
[![codecov](https://codecov.io/gh/okwolf/hyperapp-compat/branch/master/graph/badge.svg)](https://codecov.io/gh/okwolf/hyperapp-compat)
[![npm](https://img.shields.io/npm/v/hyperapp-compat.svg)](https://www.npmjs.org/package/hyperapp-compat)

Migrate your [Hyperapp](https://github.com/hyperapp/hyperapp) v1 project to v2 with console warnings informing you what refactoring you will need to do.

## Installation

```console
npm i hyperapp-compat
```

## Getting started

```diff
import { h, app } from "hyperapp";
+import withCompat from "hyperapp-compat";

-app(state, actions, view, document.body);
+withCompat(app)({
+  init,
+  view,
+  subscriptions,
+  container: document.body
+});
```

Some [examples](https://codepen.io/collection/AzwZxm) are available to show this in action.

## Migration steps

Although this package offers helpful messages on the steps needed to prepare your v1 Hyperapp for v2 sometimes it's helpful to identify what order one should attack the problem. The following steps are roughly in order of difficulty and prerequisites. By using this project you will be able to check your work in many of the intermediary states along the way.

### Refactor positional `app` args

Wrap your call to `app` in a `withCompat` call and convert the multiple arguments to a steamlined new props object:

```js
// Before
app(state, actions, view, document.body);

// After
withCompat(app)({
  init: () => state,
  actions,
  view,
  container: document.body
});
```

The state can be initialized with the new `init` function, but most everything else stays pretty much the same so far.

### Flatten nested actions

Hyperapp v1 supports a tree of [nested actions](https://github.com/jorgebucaran/hyperapp/tree/1.2.9#nested-actions) but this concept has no equivalent in v2. Now is a good time to flatten this tree in order to make later steps easier on yourself. Remember that you are now operating on the entire state tree and not just a "slice" of it. Should be a fairly mechanical refactor, you got this!

```js
// Before
const actions = {
  counter: {
    down: state => ({ count: state.count - 1 }),
    up: state => ({ count: state.count + 1 })
  }
};
const view = (state, actions) => (
  <div>
    <h1>{state.counter.count}</h1>
    <button onclick={() => actions.counter.down()}>-</button>
    <button onclick={() => actions.counter.up()}>+</button>
  </div>
);

// After
const actions = {
  down: state => ({ count: state.count - 1 }),
  up: state => ({ count: state.count + 1 })
};
const view = (state, actions) => (
  <div>
    <h1>{state.count}</h1>
    <button onclick={() => actions.down()}>-</button>
    <button onclick={() => actions.up()}>+</button>
  </div>
);
```

### Merge no more

In v2 actions will no longer shallow merge partial state objects returned from [actions](https://github.com/jorgebucaran/hyperapp/tree/1.2.9#actions). You will want to use the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals), `Object.assign`, or similar.

```js
// Before
const actions = {
  up: state => ({ count: state.count + 1 })
};

// After
const actions = {
  up: state => ({ ...state, count: state.count + 1 })
};
```

### FX

Actions used for [side effects](https://github.com/jorgebucaran/hyperapp/tree/1.2.9#asynchronous-actions) will need to be split up into [actions](https://github.com/jorgebucaran/hyperapp/issues/749) and [effects](https://github.com/jorgebucaran/hyperapp/issues/750) for v2.

### Remove wired actions from `app` and `view`

You will be delighted to know that the hip new v2 style actions and effects can be imported from anywhere (including dynamically) and directly used in your `view` - meaning you can now ditch this:

```js
const state = {
  count: 0
};

const actions = {
  down: state => ({ count: state.count - 1 }),
  up: state => ({ count: state.count + 1 })
};

const view = (state, actions) => (
  <div>
    <h1>{state.count}</h1>
    <button onclick={() => actions.down()}>-</button>
    <button onclick={() => actions.up()}>+</button>
  </div>
);

withCompat(app)({
  init: () => state,
  actions,
  view,
  container: document.body
});
```

And instead write this:

```js
const state = {
  count: 0
};

const Down = state => ({ count: state.count - 1 });
const Up = state => ({ count: state.count + 1 });

const view = state => (
  <div>
    <h1>{state.count}</h1>
    <button onclick={Down}>-</button>
    <button onclick={Up}>+</button>
  </div>
);

withCompat(app)({
  init: () => state,
  view,
  container: document.body
});
```

### Remove lazy components (subviews)

Hyperapp v1 included a feature for components to access the global state and actions known as [lazy components (sometimes called subviews)](https://github.com/jorgebucaran/hyperapp/tree/1.2.9#lazy-components). This feature was removed for v2 and so components will only receive the props that are passed into them. This may seem annoying if you are now having to pass props multiple levels deep, however this is more explicit and unmagical. This is also an opportunity to rethink the design of the components in your view and decide if there's a better way to organize things.

### Remove interop actions

To accommodate calling actions in reponse to anything other than event listeners attached to nodes in your `view` v1 returns [actions for interop](https://github.com/jorgebucaran/hyperapp/tree/1.2.9#interoperability) from `app`. You should use `init` for calling effects on app start and [subscriptions](https://github.com/jorgebucaran/hyperapp/issues/752) for external events instead.

### Remove lifecycle events

[Lifecycle events](https://github.com/jorgebucaran/hyperapp/tree/1.2.9#lifecycle-events) have been removed for Hyperapp v2. For users of this feature replacing them may seem daunting, but luckily there is an [issue](https://github.com/jorgebucaran/hyperapp/issues/717) describing many of the alternatives.

## License

Hyperapp Compat is MIT licensed. See [LICENSE](LICENSE.md).
