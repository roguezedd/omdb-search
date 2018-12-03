import fs from 'fs';
import path from 'path';

import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import compression from 'compression';

import indexTemplate from './index.pug';

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
    res.send(
        indexTemplate({assets: manifestJson.assets, state: JSON.stringify({})})
    );
});

const port = 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
