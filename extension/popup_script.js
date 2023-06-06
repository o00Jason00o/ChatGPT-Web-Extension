
document.getElementById('submit-button').addEventListener('click', () => {
    let user_api = document.getElementById('user_api').value;
    let user_prompt = document.getElementById('user_prompt').value;

    // Send the input data to the background script
    chrome.runtime.sendMessage({message: 'input_data', user_api: user_api, user_prompt: user_prompt}, (response) => {
        console.log(response.message);
    });

    // Store the input data in the chrome storage
    chrome.storage.sync.set({user_api: user_api, user_prompt: user_prompt}, () => {
        console.log('Input data has been stored.');

        // Update the displayed stored inputs
        document.getElementById('user_api_display').textContent = `API Key: ${user_api}`;
        document.getElementById('user_prompt_display').textContent = `Current Prompt: ${user_prompt}`;
    });
});

// On popup load, display the stored inputs
window.addEventListener('DOMContentLoaded', (event) => {
    chrome.storage.sync.get(['user_api', 'user_prompt'], (result) => {
        document.getElementById('user_api_display').textContent = `API Key: ${result.user_api ? result.user_api : 'None'}`;
        document.getElementById('user_prompt_display').textContent = `Instruction Prompt: ${result.user_prompt ? result.user_prompt : 'None'}`;
    });
});
