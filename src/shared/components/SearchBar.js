import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';

import {
    setSearchCriteria,
    requestSearchResults
} from '../redux/actions/searchActionCreator';

import './SearchBar.less';

class SearchBar extends React.Component {
    static propTypes = {
        searchTerm: PropTypes.string,
        errorMsg: PropTypes.string,
        onSearchCriteriaChange: PropTypes.func.required,
        onSearch: PropTypes.func.required
    };

    constructor(props) {
        super(props);
        this.onSearchTermChange = this.onSearchTermChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    onSearchTermChange(e) {
        this.props.onSearchCriteriaChange({
                field: 'searchTerm',
                value: e.target.value
        });
    }

    onSearch(e) {
        e.preventDefault();
        this.props.onSearch();
    }

    render() {
        const { searchTerm, errorMsg } = this.props;

        const errorElement = errorMsg ? (<div className='danger'>{errorMsg}</div>) : null;

        return (
            <form onSubmit={this.onSearch} className='search-bar container-fluid'>
                <InputGroup>
                    <FormControl type="text" value={searchTerm} onChange={this.onSearchTermChange}/>
                    <InputGroup.Button>
                        <Button type="submit" onClick={this.onSearch}>Search</Button>
                    </InputGroup.Button>
                </InputGroup>
                {errorElement}
            </form>
        );
    }
}

function mapStateToProps(state) {
    const { searchCriteria, searchResults } = state;
    const { searchTerm } = searchCriteria;
    const { errorMsg } = searchResults;

    return {
        searchTerm,
        errorMsg
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onSearchCriteriaChange: (payload) => {
            dispatch(setSearchCriteria(payload));
        },
        onSearch: () => {
            dispatch(requestSearchResults());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);