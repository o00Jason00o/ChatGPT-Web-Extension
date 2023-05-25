function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = decodeJwtResponse(response.credential);
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
    console.log(jsondata);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:3000/${responsePayload["sub"]}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(jsondata); // sends the request
    xhr.onload = () => {
        console.log(xhr.responseText);
    };
    document.getElementById('user_id').innerHTML = user["ID"];
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
    let inst = document.getElementById('InstructionForm');
    inst.addEventListener("submit", (err) => {
        err.preventDefault();
        let mode = document.getElementById("Instruction Text");
        if (mode.value === "") {
            alert("The value you submit is empty")
        } else {
            // pass inst value to backend
            const user_id = document.getElementById('user_id').innerHTML
            xhr = new XMLHttpRequest();
            xhr.open("GET", `http://localhost:3000/${user_id}/${mode.value}`);
            xhr.send(); // sends the request

            xhr.onload = () => {
                console.log(xhr.responseText);
            };
        }
    });
}
