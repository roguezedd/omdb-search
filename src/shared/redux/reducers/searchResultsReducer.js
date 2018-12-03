import { SET_SEARCH_RESULTS, SET_SEARCH_RESULTS_ERROR } from '../actionTypes';

function setSearchResults(state, action) {
    return { ...state, results: action.results };
}

function setSearchError(state, action) {
    return { ...state, errorMsg: action.errorMsg };
}

function searchResultsReducer(state = {}, action = {}) {
    const { type } = action;

    switch (type) {
        case SET_SEARCH_RESULTS:
            return setSearchResults(state, action);
        case SET_SEARCH_RESULTS_ERROR:
            return setSearchError(state, action);
        default:
            return state;
    }
};

export default searchResultsReducer;