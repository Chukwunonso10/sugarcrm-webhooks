const express = require('express');
const dotenv = require('dotenv')
const sugarRoutes = require('./routes/sugarRoutes');
const bodyParser = require('body-parser')
dotenv.config();

const app = express();
//app.use(express.json());
app.use(bodyParser.raw({ type: '*/*' }));

// Routes
app.use('/sugar-webhook', sugarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});











































// // Import necessary libraries.
// // 'express' is used to create our web server.
// // 'axios' is a popular library for making HTTP requests.
// const express = require('express');
// const axios = require('axios');

// // Initialize the Express application.
// const app = express();
// const PORT = 3000; // The port your server will listen on.

// // Middleware to parse incoming JSON payloads from webhooks.
// app.use(express.json());

// // --- CONFIGURATION ---
// // IMPORTANT: Replace these with your actual values.
// // You will need to obtain these from your QuickBooks Online Developer account.
// // The 'access_token' must be generated through the OAuth 2.0 flow.
// const QUICKBOOKS_ACCESS_TOKEN = "YOUR_QUICKBOOKS_ACCESS_TOKEN";
// const QUICKBOOKS_REALM_ID = "YOUR_QUICKBOOKS_REALM_ID"; // This is your QuickBooks company ID.

// // The QuickBooks API endpoint for creating a new customer.
// const QUICKBOOKS_API_URL = `https://sandbox-quickbooks.api.intuit.com/v3/company/${QUICKBOOKS_REALM_ID}/customer`;

// // --- WEBHOOK ENDPOINT ---
// // This endpoint will receive the webhook from SugarCRM.
// app.post("/sugar-webhook", async (req, res) => {
//     /**
//      * Receives a webhook POST request from SugarCRM.
//      * This function is triggered when an Account is created in SugarCRM.
//      */
//     try {
//         // Get the JSON data from the SugarCRM webhook.
//         const data = req.body;
//         console.log("Received webhook data from SugarCRM:", JSON.stringify(data, null, 2));

//         // Extract the Account Name from the SugarCRM payload.
//         // This assumes the name is in 'data.attributes.name'.
//         const accountName = data?.data?.attributes?.name;

//         if (!accountName) {
//             // If no account name is found, send an error response.
//             console.error("Error: 'accountName' not found in webhook payload.");
//             return res.status(400).json({ status: "error", message: "Account name not found" });
//         }

//         console.log(`Extracted Account Name: '${accountName}'`);

//         // Prepare the payload for the QuickBooks Online API call.
//         // The 'DisplayName' is the only required field mapping.
//         const quickbooksPayload = {
//             "DisplayName": accountName
//         };

//         // Set up the headers for the QuickBooks API request.
//         // The 'Authorization' header uses the OAuth 2.0 access token.
//         const headers = {
//             "Authorization": `Bearer ${QUICKBOOKS_ACCESS_TOKEN}`,
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         };

//         // Make the API call to QuickBooks Online to create the customer.
//         console.log("Attempting to create customer in QuickBooks...");
//         const qbResponse = await axios.post(QUICKBOOKS_API_URL, quickbooksPayload, { headers });

//         // Check the response from QuickBooks.
//         if (qbResponse.status === 200) {
//             console.log("Success! Customer created in QuickBooks.");
//             return res.status(200).json({
//                 status: "success",
//                 message: "Customer created in QuickBooks",
//                 quickbooks_response: qbResponse.data
//             });
//         } else {
//             // Handle API errors from QuickBooks.
//             console.error(`QuickBooks API Error: Status Code ${qbResponse.status}`);
//             console.error("Response Body:", qbResponse.data);
//             return res.status(qbResponse.status).json({
//                 status: "error",
//                 message: "Failed to create customer in QuickBooks",
//                 details: qbResponse.data
//             });
//         }

//     } catch (error) {
//         // Catch any unexpected errors during the process.
//         console.error(`An unexpected error occurred: ${error.message}`);
//         // For axios errors, the response is in error.response.
//         if (error.response) {
//             console.error("Error Response Body:", error.response.data);
//             return res.status(error.response.status || 500).json({ status: "error", message: error.message, details: error.response.data });
//         } else {
//             return res.status(500).json({ status: "error", message: error.message });
//         }
//     }
// });

// // --- SERVER STARTUP ---
// // Start the Express server and make it listen for requests.
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     console.log("Waiting for webhook from SugarCRM...");
// });
