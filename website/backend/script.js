const fs = require("fs");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

app.use(cors());

app.get('/', () => {
    console.log("welcome to the root!");
});

// adding user to cred.JSON
app.post('/id/', jsonParser, (req, res) => {
    const data = req.body;
    res.send("YEAH!");

    // initalize if JSON is empty
    const jsonData = fs.readFileSync("cred.json");
    const userData = JSON.parse(jsonData);
    if (userData["users"].length === 0) {
        userData["users"].push(data);
        fs.writeFile("cred.json", JSON.stringify(userData), (error) => {
            // in case of a writing problem
            if (error) {
            // logging the error
            console.error(error);
            throw error;
            }
            console.log("cred.json written correctly");
        });
    }

    // update user data if user is not in JSON
    try {
        const jsonData = fs.readFileSync("cred.json");
        const userData = JSON.parse(jsonData);
        let isin = false;
        for (i = 0; i < userData["users"].length; i++) {
            if (userData["users"][i]["ID"] === data["ID"]) {
                isin = true;
            }
        }
        if (!isin) {
            userData["users"].push(data);
            fs.writeFileSync("cred.json", JSON.stringify(userData));
            console.log("cred.json written correctly");
        }
        console.log("user already in cred.json")
    } catch (error) {
        console.log(error);
        throw error;
    }
});

app.post('/id/:inst', jsonParser, (req, res) => {
    const id = req.body;
    const inst = req.params.inst;
    res.send("YEAH!!");

    try {
        const jsonData = fs.readFileSync("cred.json");
        const userData = JSON.parse(jsonData);
        for (i = 0; i < userData["users"].length; i++) {
            if (userData["users"][i]["ID"] === id) {
                userData["users"][i]["Instruction Text"] = inst;
            }
        }
        fs.writeFileSync("cred.json", JSON.stringify(userData));
        console.log("cred.json written correctly");
    } catch (error) {
        console.log(error);
        throw error;
    }
});

app.post('/login', jsonParser, (req, res) => {

});

app.post('/id/getResponse', jsonParser, (req, res) => {
    const body = req.body;
    const id = body["ID"];
    const text = body["text"];
    let inst = "";
    try {
        const jsonData = fs.readFileSync("cred.json");
        const userData = JSON.parse(jsonData);
        for (i = 0; i < userData["users"].length; i++) {
            if (userData["users"][i]["ID"] === id) {
                inst = userData["users"][i]["Instruction Text"];
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
    const mesg = inst + " " + text;

    // ChatGPT API call
    // Define the API key
    const API_KEY = process.env.OPENAI_API_KEY;

    // Define the endpoint URL
    const endpointUrl = "https://api.openai.com/v1/chat/completions";

    // Define the headers
    const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
    };

    // Define the maximum number of completions to return
    const maxCompletions = 1;

    // Define the prompt to send to the API
    const prompt = {
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: mesg}], // change prompt to messages array
    temperature: 0.5,
    max_tokens: 20,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\n"],
    };

    // Send a POST request to the endpoint with the prompt and headers
    fetch(endpointUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(prompt), // prompt is an object, so no need to wrap it in another object.
    })
    .then((response) => response.json())
    .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Access the message object from the first choice in the response
        let message = data.choices[0].message;
        
        // Access the role and content properties of the message object
        let role = message.role;
        let content = message.content;
        
        // Log the role and content to the console
        console.log("Role: ", role);
        console.log("Content: ", content);
        res.send(content);
    })
    .catch((error) => {
        console.error(error);
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});