import { SET_SEARCH_CRITERIA } from '../actionTypes';

function setSearchCriteria(state, action) {
    return { ...state, [action.field]: action.value };
}

function searchCriteriaReducer(state = {}, action = {}) {
    const { type, payload } = action;

    switch (type) {
        case SET_SEARCH_CRITERIA:
            return setSearchCriteria(state, action);
        default:
            return state;
    }
};

export default searchCriteriaReducer;