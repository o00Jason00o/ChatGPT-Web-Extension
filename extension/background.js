function injectTextbox(text) {
  // Function to be injected
  let injectionFunction = function(text) {
      let textbox = document.createElement("textarea");
      textbox.style.position = "fixed";
      textbox.style.zIndex = 10000;
      textbox.style.left = "20px";
      textbox.style.top = "20px";
      textbox.value = text;
      document.body.appendChild(textbox);
  };

  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: injectionFunction,
          args: [text]
      });
  });
}

function getword(info, tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  injectTextbox(info.selectionText);
}

chrome.contextMenus.create({
  title: "Ask ChatGPT", 
  contexts:["selection"], 
  id: "contextMenuId"
}); 

chrome.contextMenus.onClicked.addListener(getword);
