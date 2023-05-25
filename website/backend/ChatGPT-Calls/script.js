// Define the API key
const API_KEY = process.env.OPENAI_API_KEY;

// Define the endpoint URL
const endpointUrl = "https://api.openai.com/v1/chat/completions";

// Define the headers
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

// Define the maximum number of completions to return
const maxCompletions = 1;

// Define the prompt to send to the API
const prompt = {
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Hello, World!"}], // change prompt to messages array
  temperature: 0.5,
  max_tokens: 20,
  top_p: 1,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  stop: ["\n"],
};

// Send a POST request to the endpoint with the prompt and headers
fetch(endpointUrl, {
  method: "POST",
  headers,
  body: JSON.stringify(prompt), // prompt is an object, so no need to wrap it in another object.
})
  .then((response) => response.json())
  .then((data) => {
    // Log the response data to the console
    console.log(data);

    // Access the message object from the first choice in the response
    let message = data.choices[0].message;
    
    // Access the role and content properties of the message object
    let role = message.role;
    let content = message.content;
    
    // Log the role and content to the console
    console.log("Role: ", role);
    console.log("Content: ", content);

  })
  .catch((error) => {
    console.error(error);
  });