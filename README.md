# Hyperapp Compat

[![Build Status](https://travis-ci.org/okwolf/hyperapp-compat.svg?branch=master)](https://travis-ci.org/okwolf/hyperapp-compat)
[![codecov](https://codecov.io/gh/okwolf/hyperapp-compat/branch/master/graph/badge.svg)](https://codecov.io/gh/okwolf/hyperapp-compat)
[![npm](https://img.shields.io/npm/v/hyperapp-compat.svg)](https://www.npmjs.org/package/hyperapp-compat)

Migrate your [Hyperapp](https://github.com/hyperapp/hyperapp) v1 project to v2 with console warnings informing you what refactoring you will need to do.

## Installation

```console
npm i hyperapp-compat
```

## Usage

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

## License

Hyperapp Compat is MIT licensed. See [LICENSE](LICENSE.md).