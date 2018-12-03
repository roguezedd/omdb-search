import fs from 'fs';
import path from 'path';
import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import compression from 'compression';

import indexTemplate from './index.pug';

import { requestSearchResults } from '../shared/redux/actions/searchActionCreator';
import buildStore from '../shared/redux/buildStore';
import Main from '../shared/Main';

const { PerformanceObserver, performance } = require('perf_hooks');

const manifestFile = fs.readFileSync(path.resolve(__dirname, 'stats.generated.json'));
const manifestJson = JSON.parse(manifestFile);

const TIMER_NAME = 'render-to-string';

function callback(list) {
    const perfEntry = list.getEntries()[0];
    const delta = perfEntry.duration;
    const measurementString = `${perfEntry.name} : ${delta}`;
    console.log(`${TIMER_NAME} :: ${measurementString}`);
    performance.clearMarks();
    performance.clearMeasures();
}

const obs = new PerformanceObserver(callback);
obs.observe({ entryTypes: ['measure'], buffered: true });

const app = express();

app.use(compression());

app.set('view engine', 'pug');
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    const store = buildStore({
        searchCriteria: {
            searchTerm: req.query.search
        }
    });
    store.dispatch(requestSearchResults()).then(() => {

        const stateJson = JSON.stringify(store.getState());
        const html = renderToString(<Provider store={store}><Main></Main></Provider>);

        res.send(
            indexTemplate({
                assets: manifestJson.assets,
                state: stateJson,
                html
            })
        );
    });
});

const port = 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
