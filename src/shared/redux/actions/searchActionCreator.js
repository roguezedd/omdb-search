import { METHOD, requester } from '../../requester';

import {
    SET_SEARCH_CRITERIA,
    SET_SEARCH_RESULTS,
    SET_SEARCH_RESULTS_ERROR
} from '../actionTypes';

function setSearchCriteria({ field, value }) {
    return {
        type: SET_SEARCH_CRITERIA,
        field,
        value
    }
}

function setSearchResults(results) {
    return {
        type: SET_SEARCH_RESULTS,
        results
    }
}

function setSearchResultError(errorMsg) {
    return {
        type: SET_SEARCH_RESULTS_ERROR,
        errorMsg
    }
}

function requestSearchResults() {
    return (dispatch, getState) => {
        const state = getState();
        const { searchCriteria } = state;
        const { searchTerm } = searchCriteria;

        requester({
            method: METHOD.GET,
            url: 'http://www.omdbapi.com',
            queryParams: {
                s: searchTerm,
                apikey: 'f86c0e32'
            },
            headers: { 'content-type': 'text/plain' }
        })
        .then((result) => {
            dispatch(setSearchResultError(''));
            dispatch(setSearchResults(result.data));
        }, (error) => {
            dispatch(setSearchResultError(error.message));
        })
    }
}

export {
    requestSearchResults,
    setSearchCriteria
};