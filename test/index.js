const { join } = require('path');
const { stub } = require('sinon');
const { expect } = require('chai');
const configureStore = require('redux-mock-store').default;
const { AsyncNodeStorage } = require('redux-persist-node-storage');

const { default: persistent, remove, hydrate } = require('..');

const getMockStore = (selectors, storage) => configureStore([
  persistent(selectors, { storage }),
]);

const getAsyncStorage = () => new AsyncNodeStorage(join(__dirname, 'storage'));

describe('redux-persistent', () => {
  describe('localStorage', () => {
    beforeEach(() => localStorage.clear());

    it('should save value to localstorage', () => {
      const firstState = 'firstState';
      const secondState = 'secondState';

      const selector = stub();
      selector.withArgs(firstState).returns('first');
      selector.withArgs(secondState).returns('second');

      const getState = stub();
      getState.onFirstCall().returns(firstState);
      getState.onSecondCall().returns(secondState);

      const mockStore = getMockStore({
        foo: {
          selector,
        },
      });

      const store = mockStore(getState);
      store.dispatch({ type: 'myaction' });

      const saved = localStorage.getItem('foo');
      expect(saved).to.equal('second');
    });

    it('should not save value to localstorage when the state does not change', () => {
      const firstState = 'firstState';
      const secondState = 'secondState';

      const selector = stub();
      selector.withArgs(firstState).returns('first');
      selector.withArgs(secondState).returns('second');

      const mockStore = getMockStore({
        foo: {
          selector,
        },
      });

      const store = mockStore(firstState);
      store.dispatch({ type: 'myaction' });

      const saved = localStorage.getItem('foo');
      expect(saved).to.equal(null);
    });

    it('should not save value to localstorage when the selected state does not change', () => {
      const firstState = 'firstState';
      const secondState = 'secondState';

      const selector = stub();
      selector.withArgs(firstState).returns('first');
      selector.withArgs(secondState).returns('first');

      const getState = stub();
      getState.onFirstCall().returns(firstState);
      getState.onSecondCall().returns(secondState);

      const mockStore = getMockStore({
        foo: {
          selector,
        },
      });

      const store = mockStore(getState);
      store.dispatch({ type: 'myaction' });

      const saved = localStorage.getItem('foo');
      expect(saved).to.equal(null);
    });

    it('should remove item with remove action', () => {
      localStorage.setItem('foo', 'bar');
      expect(localStorage.getItem('foo')).to.equal('bar');

      const mockStore = getMockStore({});
      const store = mockStore({});
      store.dispatch(remove('foo'));

      expect(localStorage.getItem('foo')).to.equal(null);
    });

    it('should hydrate the redux store', async () => {
      localStorage.setItem('foo', 'myvalue');

      const mockStore = getMockStore({
        foo: {
          load: ((value, { dispatch }) => {
            dispatch({
              type: 'hydrate',
              value,
            });
          }),
        },
      });

      const store = mockStore({});
      await store.dispatch(hydrate());

      expect(store.getActions()).to.deep.equal([{
        type: 'hydrate',
        value: 'myvalue',
      }]);
    });

    it('should create with empty selectors', async () => {
      localStorage.setItem('foo', 'myvalue');

      const mockStore = getMockStore(undefined);

      const store = mockStore({});
      store.dispatch({ type: 'myaction' });

      expect(store.getActions()).to.deep.equal([{
        type: 'myaction',
      }]);
    });
  });

  describe('nodeStorage', () => {
    it('should save value to storage', async () => {
      const storage = getAsyncStorage();

      const firstState = 'firstState';
      const secondState = 'secondState';

      const selector = stub();
      selector.withArgs(firstState).returns('first');
      selector.withArgs(secondState).returns('second');

      const getState = stub();
      getState.onFirstCall().returns(firstState);
      getState.onSecondCall().returns(secondState);

      const mockStore = getMockStore({
        foo: {
          selector,
        },
      }, storage);

      const store = mockStore(getState);
      await store.dispatch({ type: 'myaction' });

      const saved = await storage.getItem('foo');
      expect(saved).to.equal('second');
    });

    it('should remove item with remove action', async () => {
      const storage = getAsyncStorage();

      await storage.setItem('foo', 'bar');
      expect(await storage.getItem('foo')).to.equal('bar');

      const mockStore = getMockStore({}, storage);
      const store = mockStore({});
      await store.dispatch(remove('foo'));

      expect(await storage.getItem('foo')).to.equal(null);
    });

    it('should hydrate the redux store', async () => {
      const storage = getAsyncStorage();
      await storage.setItem('foo', JSON.stringify({ key: 'val' }));

      const mockStore = getMockStore({
        foo: {
          load: ((value, { dispatch }) => {
            dispatch({
              type: 'hydrate',
              value: JSON.parse(value),
            });
          }),
        },
      }, storage);

      const store = mockStore({});
      await store.dispatch(hydrate());

      expect(store.getActions()).to.deep.equal([{
        type: 'hydrate',
        value: { key: 'val' },
      }]);
    });
  });
});
