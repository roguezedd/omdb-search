import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import reduxImmutableMiddleware from 'redux-immutable-state-invariant';
import rootReducer from './reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

function buildStore(initState) {
    let customStoreCreator;
    if (__DEV__ && __CLIENT__) {
        customStoreCreator = composeWithDevTools(
            applyMiddleware(reduxImmutableMiddleware()),
            applyMiddleware(thunk)
        )(createStore);
    } else {
        customStoreCreator = compose(
            applyMiddleware(thunk),
        )(createStore);
    }

    return customStoreCreator(rootReducer, initState);
}

export default buildStore;