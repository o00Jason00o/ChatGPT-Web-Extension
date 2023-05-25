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
app.post('/:id/', jsonParser, (req, res) => {
    var id = req.params.id;
    var data = req.body;
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

app.get('/:id/:inst', (req, res) => {
    var id = req.params.id;
    var inst = req.params.inst;
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

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});