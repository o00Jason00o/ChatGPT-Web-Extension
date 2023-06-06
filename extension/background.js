//const API_KEY = process.env.OPENAI_API_KEY; //TO BE MODIFIED LATER TO USER-BASED
let user_key = ""
let prompt_text = ""

async function injectTextbox(API_KEY, text) {
  let response = await getResponse(API_KEY, text);
  //response = user_key + " " + prompt_text;
  
  // We'll be passing response as an argument
  let injectionFunction = function(response) {
      let textbox = document.createElement("textarea");
      textbox.style.position = "fixed";
      textbox.style.zIndex = 10000;
      textbox.style.left = "20px";
      textbox.style.top = "20px";
      textbox.value = response;
      document.body.appendChild(textbox);
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
      sendResponse({message: 'Input data was received.'});
  }
});

chrome.storage.sync.get(['user_api', 'user_prompt'], (result) => {
  user_key = result.user_api
  prompt_text = result.user_prompt
  console.log('Input 1 is', result.user_api);
  console.log('Input 2 is', result.user_prompt);
});