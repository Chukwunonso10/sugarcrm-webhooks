const axios = require('axios');
const dotenv = require('dotenv');
const Token = require('../models/tokenModel');

dotenv.config()


// The base URL for the QuickBooks API.
const QUICKBOOKS_BASE_URL = `https://quickbooks.api.intuit.com/v3/company/${process.env.QUICKBOOKS_REALM_ID}`;

const API = axios.create({
    baseURL: QUICKBOOKS_BASE_URL
});

API.interceptors.request.use(
    async (config) => {
        const tokenDoc = await Token.findOne()
        if (tokenDoc && tokenDoc.accessToken ) {
        config.headers.Authorization = `Bearer ${tokenDoc.accessToken}`;
        }
        // specify the content and accept types.
        config.headers['Content-Type'] = 'application/json';
        config.headers.Accept = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response)=> {
        return response
    },
    async (error)=>{
        if (error.response && error.response.status === 401){
            console.log("Access token expired. refreshing...")
            try {
                const refreshTokenDoc = await Token.findOne()
                const refreshToken = refreshTokenDoc?.refreshToken || process.env.REFRESH_TOKEN

                if (!refreshToken){
                    throw new Error("No refresh token available. Please reconnect to QuickBooks")
                }

                const refreshTokenResponse = await axios.post("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
                    new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken}),
                    { headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString("base64")
                    }}
                )
            
                const newAccessToken = refreshTokenResponse.data.access_token
                const newRefreshToken = refreshTokenResponse.data.refresh_token
            //store in-memory
            //  process.env.QUICKBOOKS_ACCESS_TOKEN = accessToken
            //  process.env.REFRESH_TOKEN = refresh_token
            await Token.findOneAndUpdate({}, {accessToken: newAccessToken, refreshToken: newRefreshToken}, {new: true, upsert: true})
            
            console.log("token refreshed successfully ")
            // Retry the failed request with new token
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(error.config);

            } catch (refreshError) {
                console.error(" Refresh token failed:", refreshError.response?.data || refreshError.message);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

module.exports = API;







