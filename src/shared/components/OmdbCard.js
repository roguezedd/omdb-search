import React from 'react';
import PropTypes from 'prop-types';

import './OmdbCard.less';

class OmdbCard extends React.Component {
    static propTypes = {
        media: PropTypes.shape({
            Title: PropTypes.string,
            Year: PropTypes.string,
            Type: PropTypes.string,
            Poster: PropTypes.string
        })
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { media }  = this.props;
        const { Title, Year, Type, Poster } = media;

        return (
            <section className='omdbcard'>
                <div className='omdbcard__content'>
                    <img className='omdbcard__image' src={Poster}/>
                    <div className='omdbcard__metadata'>
                        <h4 className='omdbcard__title'>{ Title }</h4>
                        <div className='omdbcard__year'><span>Year: </span><span>{ Year }</span></div>
                        <div className='omdbcard__type'><span>Type: </span><span>{ Type }</span></div>
                    </div>
                </div>
            </section>
        );
    }
}

export default OmdbCard;