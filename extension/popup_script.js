document.getElementById('submit-button').addEventListener('click', () => {
    let user_api = document.getElementById('user_api').value;
    let user_prompt = document.getElementById('user_prompt').value;

    let input_data = {};

    // Check if user_api is not empty
    if(user_api.trim() !== "") {
        input_data.user_api = user_api;
        chrome.storage.sync.set({user_api: user_api}, () => {
            console.log('user_api has been stored.');
            document.getElementById('user_api_display').textContent = `API Key: ${user_api}`;
        });
    }

    // Check if user_prompt is not empty
    if(user_prompt.trim() !== "") {
        input_data.user_prompt = user_prompt;
        chrome.storage.sync.set({user_prompt: user_prompt}, () => {
            console.log('user_prompt has been stored.');
            document.getElementById('user_prompt_display').textContent = `Current Prompt: ${user_prompt}`;
        });
    }

    if(Object.keys(input_data).length > 0) {
        // Send the input data to the background script
        chrome.runtime.sendMessage({message: 'input_data', ...input_data}, (response) => {
            console.log(response.message);
        });
    }
});

// On popup load, display the stored inputs
window.addEventListener('DOMContentLoaded', (event) => {
    chrome.storage.sync.get(['user_api', 'user_prompt'], (result) => {
        document.getElementById('user_api_display').textContent = `API Key: ${result.user_api ? result.user_api : 'None'}`;
        document.getElementById('user_prompt_display').textContent = `Instruction Prompt: ${result.user_prompt ? result.user_prompt : 'None'}`;
    });
});
