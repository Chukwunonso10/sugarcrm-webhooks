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
console.log(process.env.CLIENT_ID)
console.log(process.env.CLIENT_SECRET)
API.interceptors.response.use(
    (response)=> {
        return response
    },
    async (error)=>{
        if (error.response && error.response.status === 401){
            console.log("Access token expired. refreshing...")
            try {
                const refreshToken = await axios.post("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
                    new URLSearchParams({ grant_type: "refresh_token", refresh_token: process.env.REFRESH_TOKEN}),
                    { headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString("base64")
                    }}
                 )

                 const accessToken = refreshToken.data.access_token
                 const refresh_token = refreshToken.data.refresh_token

                 console.log("token refreshed successfully ")
                  // Retry the failed request with new token
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return axios(error.config);

            } catch (refreshError) {
                console.error(" Refresh token failed:", refreshError.response?.data);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(refreshError);
    }
)

module.exports = API;

