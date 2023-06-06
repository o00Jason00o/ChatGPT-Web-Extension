//const API_KEY = process.env.OPENAI_API_KEY; //TO BE MODIFIED LATER TO USER-BASED
let user_key = ""
let prompt_text = ""

async function injectTextbox(API_KEY, text) {
  let response = await getResponse(API_KEY, text);
  let injectionFunction = function(response) {
      // Create a wrapper div
      let wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.zIndex = 10000;
      wrapper.style.left = "20px";
      wrapper.style.top = "20px";
      wrapper.style.border = "1px solid black";
      wrapper.style.backgroundColor = "white";

      // Create the close button
      let closeButton = document.createElement("button");
      closeButton.textContent = "X";
      closeButton.style.position = "absolute";
      closeButton.style.right = "0";
      closeButton.style.top = "0";
      closeButton.addEventListener("click", function() {
          document.body.removeChild(wrapper);
      });

      // Create the textbox
      let textbox = document.createElement("textarea");
      textbox.style.width = "400px"; // Adjust width as needed
      textbox.style.height = `${(response.split('\n').length + 1) * 3.5}em`; // adjust height based on number of lines
      textbox.value = response;

      // Append the textbox and the close button to the wrapper
      wrapper.appendChild(closeButton);
      wrapper.appendChild(textbox);

      // Append the wrapper to the body
      document.body.appendChild(wrapper);
  };

  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: injectionFunction,
          args: [response]  // Pass response as an argument
      });
  });
}





function getword(info, tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  injectTextbox(user_key, prompt_text + ": " + info.selectionText);
}

chrome.contextMenus.create({
  title: "Ask ChatGPT", 
  contexts:["selection"], 
  id: "contextMenuId"
}); 

chrome.contextMenus.onClicked.addListener(getword);


//------------------------------------------------------------------------------------------------------//

async function getResponse(API_KEY, text) {
  // Define the endpoint URL
  const endpointUrl = "https://api.openai.com/v1/chat/completions";

  // Define the headers
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
  };

  // Define the prompt to send to the API
  const prompt = {
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: text}],
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
    })
    let data = await response.json();
    // Access the message object from the first choice in the response
    let message = data.choices[0].message;
  
    // Access the role and content properties of the message object
    let role = message.role;
    let content = message.content;
  
    // Log the role and content to the console
    console.log("Role: ", role);
    console.log("Content: ", content);

    // Return the content
    return content;
  } catch(error) {
    console.error(error);
  }
  
}


//-----------------------Event Listeners-----------------------------------------------------------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'input_data') {
      console.log('Received input data:', request.user_api, request.user_prompt);
      
      // Update the variables with the received data
      if(request.user_api) {
          user_key = request.user_api
          console.log('Input 1 is', user_key);
      }
      if(request.user_prompt) {
          prompt_text = request.user_prompt
          console.log('Input 2 is', prompt_text);
      }
      
      sendResponse({message: 'Input data was received.'});
  }
});