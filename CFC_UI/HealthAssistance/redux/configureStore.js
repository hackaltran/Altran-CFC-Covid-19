import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { user } from './user';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

export const ConfigureStore = () => {

    const config = {
        key: 'root',
        storage,
        debug: true
    }

    // persist store
    const store = createStore(
        persistCombineReducers(config, {
            user
        }),
        applyMiddleware(thunk, logger)
    );
    
    // non persistant store
    // const store = createStore(
    //     combineReducers({
    //         user
    //     }),
    //     applyMiddleware(thunk, logger)
    // );

    const persistor = persistStore(store);
    
    return { persistor, store };

       
    // return store;
}