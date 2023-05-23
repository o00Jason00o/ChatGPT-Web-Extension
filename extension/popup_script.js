window.onload = function() {


    const btn = document.getElementById("loginBtn");
    btn.addEventListener("click", () => {

        chrome.tabs.create({  
            url: "http://www.google.com/" //replace with login page URL
        });
    })
}