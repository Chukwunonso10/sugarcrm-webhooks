const  API  = require('../services/quickBookServices')

const handleSugarWebhook = async (req, res) => {
  try {
    const rawData = req.body.toString('utf8');
    console.log("Received webhook data from SugarCRM:", JSON.stringify(rawData, null, 2));

    if (!rawData){
      console.log("Empty data was received: ")
      res.status(404).json({ messsage: "Empty webhook payload "})
    }
    
    const data = JSON.parse(rawData)
    console.log("Parsed webhook data from SugarCRM:", JSON.stringify(data, null, 2));

    const accountName = data?.data?.name;
    if (!accountName) {
      console.log("Account Name Not found ")
      return res.status(400).json({message: "Account name not found" });
    }

    console.log("account name is :" + accountName)

    const quickbooksPayload = { "DisplayName": accountName}

    const response = await API.post('/customer', quickbooksPayload)
    console.log("New Account created in quickbooks")
    res.status(201).json({ success: true, message: "New Customer Name successfully created ", response: res.data})
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

