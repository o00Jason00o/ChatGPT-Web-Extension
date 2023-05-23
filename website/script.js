function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = decodeJwtResponse(response.credential);
    const fs = require('fs');
    const user = {
        "ID": responsePayload["sub"],
        "Full Name": responsePayload["name"],
        "Given Name": responsePayload["given_name"],
        "Family Name": responsePayload["family_name"],
        "Image URL": responsePayload["picture"],
        "Email": responsePayload["email"],
        "Instruction Text": "",
    };

    const jsondata = JSON.stringify(user);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:3000/body=${jsondata}`);
    xhr.send(); // sends the request

    xhr.onload = function() {}
}

function decodeJwtResponse(token) {
    // decoding of JWT Response
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

window.onload = function() {
    let mode = document.getElementById('InstructionForm');
    mode.addEventListener("submit", (err) => {
        err.preventDefault();
        let mode = document.getElementById("Instruction Text");
        if (mode.value === "") {
            alert("The value you submit is empty")
        } else {
            // pass mode value to backend
            xhr = new XMLHttpRequest();
            xhr.open("GET", `http://localhost:3000/${mode.value}`);
            xhr.send(); // sends the request
            
            xhr.onload = function() {}
        }
    });
}
