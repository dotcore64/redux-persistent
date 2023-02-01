# redux-persistent

[![Build Status][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]

> Meant as an alternative to [redux-persist](https://github.com/rt2zz/redux-persist), providing a selector based API, while remaining compatible with its persistors ecosystem.

## Install

Install the package using:

```
# npm package
$ npm install --save redux-persistent
```

## Usage

Simple demo:

```js
import { createStore, applyMiddleware } from 'redux';
import persistent, { hydrate } from 'redux-persistent';
import { setUsername } from './actions';

const store = createStore(reducer, initialState, applyMiddleware(
  persistent({
    username: { // persists the result of getUsername(state) inside the provided storage, under the keye 'username'
      selector: getUsername,
      load: (username, ({ dispatch })) => dispatch(setUsername(username)),
    },
  }, {
    storage: localStorage, // optional, defaults to localStorage, also tested with redux-persist-node-storage
  }),
))

store.dispatch(hydrate());
```

This module relies on ES6 `Symbol`, so it needs to be polyfilled in environments where it is not supported. For example:

```
import 'core-js/features/symbol';
```

Or if using `rollup`, you can use [rollup-plugin-polyfill](https://www.npmjs.com/package/rollup-plugin-polyfill).

# API

## persist

The default export of this module, and the redux middleware. Accepts the following arguments:

### selectors

Type: `Object`, required

Key-value pair. The key will be used to store the item inside the provided storage, while the value is an object with the shape `{ selector: (state) => any, load: (value, store) => void }`. The selector defines the value to store, and `load` defines how to restore the value into the redux store.

```javascript
const selectors = {
  [key]: {
    selector: (state: Object) => any, // serializable
    load: (value: any, { dispatch, getState }) => void,
  },
};
```

### options

#### options.storage

A `redux-persist` compatible [storage](https://github.com/rt2zz/redux-persist#storage-engines). It is an object of the shape:

```javascript
const storage = {
  getItem: (key: String) => Promise<any> | any,
  setItem: (key: String, value: any) => Promise<void> | void,
  removeItem: (key: String) => Promise<void> | void,
};
```

By default, `const storage = localStorage`.

## hydrate

An action creater to load the stored state into the redux store.

## remove

An action creator to remove a stored item from the provided storage.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).


[build-badge]: https://img.shields.io/github/actions/workflow/status/dotcore64/redux-persistent/test.yml?event=push&style=flat-square
[build]: https://github.com/dotcore64/redux-persistent/actions

[npm-badge]: https://img.shields.io/npm/v/redux-persistent.svg?style=flat-square
[npm]: https://www.npmjs.org/package/redux-persistent

[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/redux-persistent/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/dotcore64/redux-persistent
