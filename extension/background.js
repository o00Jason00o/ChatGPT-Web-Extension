let user_key = "";
let prompt_text = "";
let currentTabID;
// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Function to update user_key and prompt_text
async function updateInputs() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['user_api', 'user_prompt'], function(result) { // use sync here
      if (chrome.runtime.lastError) {
        // If there is an error, reject the promise
        reject(chrome.runtime.lastError);
      } else {
        if (result.user_api) {
          user_key = result.user_api;
          console.log("Updated API Key is", user_key);
        }
        if (result.user_prompt) {
          prompt_text = result.user_prompt;
          console.log("Updated Prompt is", prompt_text);
        }
        // If successful, resolve the promise
        resolve();
      }
    });
  });
}

async function injectTextbox(API_KEY, text, retryCount = 0) {
  let response = await getResponse(API_KEY, text);
  if (response === undefined) {
    // Retry if the maximum number of attempts has not been reached
    if (retryCount < MAX_RETRIES) {
      console.log(`Attempt ${retryCount + 1} failed. Retrying...`);

      // Update the inputs before retrying
      await updateInputs();

      injectTextbox(user_key, prompt_text + ": " + text, retryCount + 1);
    } else {
      console.error(`Failed to get a response after ${MAX_RETRIES} attempts.`);
    }
    return;
  }

  let injectionFunction = function (response) {
    // Create a wrapper div
    let wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.zIndex = "10000";
    wrapper.style.left = "20px";
    wrapper.style.top = "20px";
    wrapper.style.border = "1px solid #ddd";
    wrapper.style.backgroundColor = "#fff";
    wrapper.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.1)";
    wrapper.style.borderRadius = "10px";
    wrapper.style.padding = "20px";
    wrapper.style.fontFamily = "'Arial', sans-serif";

    // Create the close button
    let closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.right = "0";
    closeButton.style.top = "0";
    closeButton.addEventListener("click", function () {
      document.body.removeChild(wrapper);
    });

    // Create the textbox
    let textbox = document.createElement("textarea");
    textbox.style.width = "400px"; // Adjust width as needed
    textbox.style.height = `${
      response.split("\n").length + 1
    }em`; // adjust height based on number of lines
    textbox.value = response;

    // Append the textbox and the close button to the wrapper
    wrapper.appendChild(closeButton);
    wrapper.appendChild(textbox);

    // Append the wrapper to the body
    document.body.appendChild(wrapper);
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!currentTabId) {
      console.error("No active tabs found");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      function: injectionFunction,
      args: [response],
    });
    currentTabId = null;
  });
}


function getword(info, tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  currentTabId = tab.id;  // Store the current tab id
  injectTextbox(user_key, prompt_text + ": " + info.selectionText);
}

async function getResponse(API_KEY, text) {
  // Define the endpoint URL
  const endpointUrl = "https://api.openai.com/v1/chat/completions";

  // Define the headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };

  // Define the prompt to send to the API
  const prompt = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: text }],
    temperature: 0.5,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\n"],
  };

  try {
    let response = await fetch(endpointUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(prompt),
    });
    let data = await response.json();
    if (data.choices === undefined || data.choices.length === 0) {
      console.log("No choices in the API response");
      return;
    }

    let message = data.choices[0].message;

    // Access the role and content properties of the message object
    let role = message.role;
    let content = message.content;

    // Log the role and content to the console
    console.log("Role: ", role);
    console.log("Content: ", content);

    // Return the content
    return content;
  } catch (error) {
    // Log the error and return undefined
    console.log(error);
    return;
  }
}

// Always create (or recreate) the context menu item
chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create(
    {
      title: "Ask ChatGPT",
      contexts: ["selection"],
      id: "contextMenuId",
    },
    () => {
      // Context menu item creation callback
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to create context menu item:",
          chrome.runtime.lastError
        );
      } else {
        console.log("Context menu item created successfully");
      }
    }
  );
});

chrome.contextMenus.onClicked.addListener(getword);

//-----------------------Event Listeners-----------------------------------------------------------------//

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "input_data") {
    console.log("Received input data:", request.user_api, request.user_prompt);

    // Update the variables with the received data
    if (request.user_api) {
      user_key = request.user_api;
      console.log("Input 1 is", user_key);
    }
    if (request.user_prompt) {
      prompt_text = request.user_prompt;
      console.log("Input 2 is", prompt_text);
    }

    sendResponse({ message: "Input data was received." });
  }
});
