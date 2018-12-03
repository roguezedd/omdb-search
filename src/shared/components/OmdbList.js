import React from 'react';
import PropTypes from 'prop-types';

import connect from 'react-redux/es/connect/connect';
import OmdbCard from './OmdbCard';

import './OmdbList.less';

class OmdbList extends React.Component {
    static propTypes = {
        mediaList: PropTypes.array
    };

    static defaultProps = {
        mediaList: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { mediaList }  = this.props;

        const renderedCards = mediaList.map(media => (
            <OmdbCard key={media.imdbID} media={media} />
        ));

        return (
            <div className='omdblist'>
                { renderedCards }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { searchResults = {} } = state;
    const { results = {} } = searchResults;

    return {
        mediaList: results.Search
    }
}

export default connect(mapStateToProps)(OmdbList);