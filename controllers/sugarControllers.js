const  API  = require('../services/quickBookServices')

const handleSugarWebhook = async (req, res) => {
  try {
    const rawData = req.body.toString('utf8');
    console.log("Received webhook data from SugarCRM:", rawData);

    if (!rawData){
      console.log("Empty data was received: ")
      res.status(404).json({ messsage: "Empty webhook payload "})
    }
    
    const data = JSON.parse(rawData)
    console.log("Parsed webhook data from SugarCRM:", JSON.stringify(data, null, 2));

        // Extract all relevant fields from the webhook payload
    const accountName = data?.data?.name;
    const companyName = data?.data?.companyName; 
    const firstName = data?.data?.first_name;
    const lastName = data?.data?.last_name;
    const phone = data?.data?.phone_office;
    const email = data?.data?.email1;
    const emailList = data?.data?.email;
    const accountType = data?.data?.account_type;
  
    
    if (!accountName) {
      console.log("Account Name Not found ")
      return res.status(400).json({message: "Account name not found" });
    }
    if (!accountType) {
      console.log("Account Type Not defined ")
      return res.status(400).json({message: "Account Type not found" });
    }

    if (accountType !== "Customer") return res.status(400).json({ message: "Account_type mismatch, pls enter Customer account_type "})

    console.log("account name is :" + accountName)
    console.log("company name is :" + companyName)
    console.log("phone number is :" + phone)
    console.log("first Name is :" + firstName)
    console.log("Last Name is :" + lastName)
    console.log("email is :" + email)
    console.log("email list is :" + emailList)
    console.log("Account Type is :" + accountType)

      // Build the QuickBooks payload with the new fields
    const quickbooksPayload = {
        "DisplayName": accountName,
        "CompanyName": companyName,
        "FamilyName": lastName,
        "GivenName": firstName ,
        "PrimaryEmailAddr":{
          "Address": email
        },
        "PrimaryPhone": {
        "FreeFormNumber": phone
      },
  }

    const response = await API.post('/customer', quickbooksPayload)
    console.log("New Account created in quickbooks")
    res.status(200).json({ success: true, message: "New Customer Name successfully created ", response: res.data})
  }

  catch (error) {
    console.error("unexpected error has occurred: " + error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      details: error.response?.data || error.message});
  }
};


module.exports = handleSugarWebhook; 








// Received webhook data from SugarCRM: {
//   "bean": "Account",
//   "data": {
//     "id": "bdc5a8ca-79ca-11f0-b7b4-1da234fa7e25",
//     "name": "Mango",
//     "date_entered": "2025-08-15T12:26:52+01:00",
//     "date_modified": "2025-08-15T13:14:27+01:00",
//     "modified_user_id": "1",
//     "modified_by_name": "admin",
//     "modified_user_link": {
//       "full_name": "admin",
//       "id": "1",
//       "_acl": {
//         "fields": {

//         }
//       }
//     },
//     "created_by": "1",
//     "created_by_name": "",
//     "created_by_link": {
//       "full_name": "",
//       "id": "1",
//       "_acl": {

//       }
//     }
//   },
//   "isUpdate": true,
//   "dataChanges": {
//   	"modified_by_name": {
//   		"field_name": "modified_by_name",
//   		"data_type": "relate",
//   		"before": "Jen Smith",
//   		"after": "admin"
//   	}
//   }
// }