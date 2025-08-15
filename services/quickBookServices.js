const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config()

// The base URL for the QuickBooks API.
const QUICKBOOKS_BASE_URL = `https://sandbox-quickbooks.api.intuit.com/v3/company/${process.env.QUICKBOOKS_REALM_ID}`;

const API = axios.create({
    baseURL: QUICKBOOKS_BASE_URL
});

API.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${process.env.QUICKBOOKS_ACCESS_TOKEN}`;
        // specify the content and accept types.
        config.headers['Content-Type'] = 'application/json';
        config.headers.Accept = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

module.exports = API;

