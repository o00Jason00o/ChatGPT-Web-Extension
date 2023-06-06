/** 
window.onload = function() {


    const btn = document.getElementById("loginBtn");
    btn.addEventListener("click", () => {

        chrome.tabs.create({  
            url: "http://www.google.com/" //replace with login page URL
        });
    })
}
*/

document.getElementById('submit-button').addEventListener('click', () => {
    let input1 = document.getElementById('input1').value;
    let input2 = document.getElementById('input2').value;

    // Send the input data to the background script
    chrome.runtime.sendMessage({message: 'input_data', input1: input1, input2: input2}, (response) => {
        console.log(response.message);
    });

    // Store the input data in the chrome storage
    chrome.storage.sync.set({input1: input1, input2: input2}, () => {
        console.log('Input data has been stored.');

        // Update the displayed stored inputs
        document.getElementById('input1-display').textContent = `Input 1: ${input1}`;
        document.getElementById('input2-display').textContent = `Input 2: ${input2}`;
    });
});

// On popup load, display the stored inputs
window.addEventListener('DOMContentLoaded', (event) => {
    chrome.storage.sync.get(['input1', 'input2'], (result) => {
        document.getElementById('input1-display').textContent = `Input 1: ${result.input1 ? result.input1 : 'None'}`;
        document.getElementById('input2-display').textContent = `Input 2: ${result.input2 ? result.input2 : 'None'}`;
    });
});
