import axios from 'axios';

const METHOD = {
    GET: 'get',
    POST: 'post'
};

const requester = ({method, url, queryParams={}, headers= {}, body={}} = {}) => {
    const options = {
        method,
        url,
        params: queryParams,
        data: body,
        headers,
    };

    return axios(options);
};

export {
    METHOD,
    requester
};