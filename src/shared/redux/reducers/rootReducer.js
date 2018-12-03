import { combineReducers } from 'redux';
import searchCriteriaReducer from './searchCriteriaReducer';
import searchResultsReducer from './searchResultsReducer';

const rootReducer = combineReducers({
    searchCriteria: searchCriteriaReducer,
    searchResults: searchResultsReducer
});

export default rootReducer;