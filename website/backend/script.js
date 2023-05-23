const fs = require("fs");
const express = require('express');
const request = require("request");
const cors = require('cors');

// initalize if JSON is empty

const jsonData = fs.readFileSync("cred.json");
const userData = JSON.parse(jsonData);
if (userData["users"].length === 0) {
    userData["users"][0] = data;
    fs.writeFile("cred.json", data, (error) => {
        // in case of a writing problem
        if (error) {
          // logging the error
          console.error(error);
          throw error;
        }
        console.log("data.json written correctly");
    });
}

// update user data if user is not in JSON
try {
    const jsonData = fs.readFileSync("cred.json");
    const userData = JSON.parse(jsonData);
    const isin  = false;
    for (i = 0; i < userData["users"].length; i++) {
        if (userData["users"][i]["ID"] === data["ID"]) {
            isin = true;
        }
    }
    if (!isin) {
        userData["users"].push(data);
    }
    fs.writeFileSync("cred.json", data);
} catch (error) {
    console.log(error);
    throw error;
}

console.log("data.json written correctly");