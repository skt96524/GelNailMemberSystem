import { applyMiddleware, compose, legacy_createStore as createStore } from 'redux'
import { rootReducer } from './reducer'
import thunk from 'redux-thunk'

const rootEnhancer = compose(
    applyMiddleware(thunk)
)

export let store = createStore(rootReducer, rootEnhancer)

