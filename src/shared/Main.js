import React from 'react';
import withPerformance from './withPerformance';
import SearchBar from './components/SearchBar';
import OmdbList from './components/OmdbList';

import './omdbMain.less';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className='omdbmain'>
            <header>
              <SearchBar/>
            </header>
            <div className='omdbmain__content'>
              <OmdbList/>
            </div>
        </div>
    );
  }
}

export default Main;