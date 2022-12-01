const HYDRATE = Symbol('HYDRATE');
const REMOVE = Symbol('REMOVE');

export const hydrate = () => ({ [HYDRATE]: true });
export const remove = (key) => ({ [REMOVE]: key });

const noop = () => {};

const mapObject = (mapper, obj) => {
  const result = {};

  Object.keys(obj).forEach((key) => {
    result[key] = mapper(obj[key]);
  });

  return result;
};

let hydrating = false;

export default (
  selectors = {},
  { storage = localStorage } = {},
) => ({ dispatch, getState }) => (next) => (action) => {
  if (action[HYDRATE]) {
    hydrating = true;

    return Promise.all(
      Object
        .keys(selectors)
        .map((key) => Promise.resolve(storage.getItem(key)) // Normalize into promise
          .then((value) => {
            const { load = noop } = selectors[key];

            return load(value, { dispatch, getState });
          })),
    ).then(() => { hydrating = false; });
  }

  if (action[REMOVE]) {
    return Promise.resolve(storage.removeItem(action[REMOVE]));
  }

  if (hydrating) {
    return next(action);
  }

  const prevState = getState();
  const prevValues = mapObject(({ selector }) => selector(prevState), selectors);

  next(action);

  const state = getState();

  if (state === prevState) { // selectors are pure functions of the state
    return Promise.resolve();
  }

  return Promise.all(
    Object.keys(selectors).map((key) => {
      const { selector } = selectors[key];
      const value = selector(state);

      return (value === prevValues[key])
        ? undefined
        : storage.setItem(key, value);
    }),
  );
};
