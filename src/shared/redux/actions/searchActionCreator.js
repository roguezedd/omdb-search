import Promise from 'promise';
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

const EMPTY_SEARCH_RESULT = { Search: []};

function getSearchTerm(state) {
    const { searchCriteria } = state;
    const { searchTerm } = searchCriteria;
    return searchTerm;
}

function requestSearchResults() {
    return (dispatch, getState) => {
        const state = getState();
        const searchTerm = getSearchTerm(state);

        if ( !searchTerm ) {
            dispatch(setSearchResultError(''));
            dispatch(setSearchResults(EMPTY_SEARCH_RESULT));
            return new Promise.resolve({ data: EMPTY_SEARCH_RESULT });
        }

        return requester({
            method: METHOD.GET,
            url: 'http://www.omdbapi.com',
            queryParams: {
                s: searchTerm,
                apikey: 'f86c0e32'
            },
            headers: { 'content-type': 'text/plain' }
        })
        .then((result) => {
            if (result.data.Error) {
                dispatch(setSearchResultError(result.data.Error));
                dispatch(setSearchResults(EMPTY_SEARCH_RESULT));
                return result;
            }

            dispatch(setSearchResultError(''));
            dispatch(setSearchResults(result.data));
            return result;
        }, (error) => {
            dispatch(setSearchResultError(error.message));
            return error;
        })
    }
}

function updateSearchQueryParam() {
    return (dispatch, getState) => {
        const state = getState();
        const searchTerm = getSearchTerm(state);
        window.history.pushState({search: searchTerm}, '', `?search=${searchTerm}`);
    };
}

function initHistorySearchState() {
    return (dispatch, getState) => {
        const state = getState();
        const searchTerm = getSearchTerm(state);
        window.history.replaceState({search: searchTerm}, '', `?search=${searchTerm}`);
    };
}

export {
    initHistorySearchState,
    requestSearchResults,
    setSearchCriteria,
    updateSearchQueryParam
};