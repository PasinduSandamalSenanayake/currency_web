const express = require("express");
const cors = require("cors"); // Import the 'cors' middleware, Which allows Cross-Origin Resource Sharing(CORS) for API.
                              // CORS is essential for handing requests from different origins(a front end application running on a different domain.)
const axios = require("axios"); // Used to make HTTP requests to external APIs

const app = express(); 

// middle wares
app.use(express.json());
app.use(cors());

//all currencies
app.get("/getAllCurrencies" , async (req, res)=>{
    const nameURL = "https://openexchangerates.org/api/currencies.json?app_id=092f0f6232ad46c9844adc18d9525be5";

    try{
        const nameResponce = await axios.get(nameURL);
        const nameData = nameResponce.data;
        return res.json(nameData); // codes is sent to the client as a JSON response using "res.json(nameData)"
    }catch(err){
        console.error(err);
    }
})

//get target amount
app.get("/convert", async (req, res)=> {
    const {date, sourceCurrency,targetCurrency, amountInSourceCorrency } = req.query;
    try{
        const dataURL = `https://openexchangerates.org/api/historical/${date}.json?app_id=092f0f6232ad46c9844adc18d9525be5`; // ` reason for use is add the varible in the middle of the url
        const dataResponce = await axios.get(dataURL);
        const rates = dataResponce.data.rates; // data and rates, quaries in the URL

        // Calculate the amount of target currency
        const sourceRate = rates[sourceCurrency];
        const targetRate = rates[targetCurrency];
        const targetAmount = (targetRate/sourceRate) * amountInSourceCorrency;

        return res.json(targetAmount.toFixed(2)); // two decimal points in the target currency
    }catch(err){
        console.error(err);
    }

    
});

//listen to a port
app.listen(5000, () => {
    console.log("SERVER STARTED");
});