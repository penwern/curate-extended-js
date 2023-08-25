var curateLogoURL = "/a/frontend/binaries/GLOBAL/db3b6faa-8a7.png"
var contUsURL = "https://www.penwern.co.uk/contact"
//console.log(timeTil)

function getFormValues() {
  const name = document.querySelector("#fname").value;
  const email = document.querySelector("#emailAddress").value;
  const message = document.querySelector("#subject").value;
  return { name, email, message };
}

function getTimeFromServer(callback) {
  const url = `https://${window.location.hostname}:6904/get_time`;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function () {
    callback(xhr.response);
  });
  xhr.open("GET", url);
  xhr.send();
}

function submitMail() {
  const url = `https://${window.location.hostname}:6905/send_demo_mail`;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      console.log("Mail sent successfully");
      pydio.displayMessage("", "Message sent");
      clearFormFields();
    }
  });

  const formData = getFormValues();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(formData));
}

function toggleContactForm() {
  const cForm = document.querySelector("#cForm");
  cForm.style.visibility = cForm.style.visibility === "visible" ? "hidden" : "visible";
  cForm.style.opacity = cForm.style.opacity === "1" ? "0" : "1";
}

function formatTime(totalSeconds) {
  const totalMilliseconds = totalSeconds * 1000;
  const timeString = new Date(totalMilliseconds).toISOString().slice(11, 19);
  return timeString;
}

function initializeDemo() {
  // Create the death counter banner
  const dBan = createDeathCounterBanner();
  document.body.appendChild(dBan);

  // Create and add the contact form
  const cForm = createContactForm();
  const cBtnDiv = createContactButton();
  document.body.appendChild(cForm);
  document.body.appendChild(cBtnDiv);

  // Get the server time and set up the countdown
  getTimeFromServer(function (timeTil) {
    const dBanT = document.querySelector("#pydio-demo-death-counter span");
    setInterval(function () {
      if (timeTil > 0) {
        timeTil--;
        dBanT.innerText = toTimeString(timeTil);
      } else if (pydio.user.id !== "admin") {
        resetDemoSession();
      }
    }, 1000);
  });
}

function createDeathCounterBanner() {
  const dBan = document.createElement("div");
  dBan.innerHTML = `
    <div id="pydio-demo-death-counter">
      <div style="
        position: absolute;
        z-index: 10000;
        background-color: rgba(0, 0, 0, 0.30);
        font-size: 16px;
        top: 0px;
        left: 41%;
        width: 18%;
        min-width: 200px;
        padding: 8px 10px;
        border-radius: 0px 0px 2px 2px;
        text-align: center;
        color: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 35px, rgba(0, 0, 0, 0.12) 0px 5px 10px;">
        <span class="icon-warning-sign"></span> This demo will next reset itself in:
      </div>
    </div>
  `;
  const dBanT = document.createElement("div");
  dBanT.style = "position: relative; top: 0.1em;";
  dBan.querySelector("#pydio-demo-death-counter").appendChild(dBanT);
  return dBan;
}

function createContactForm() {
  const cForm = document.createElement("div");
  cForm.style = `
    box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 35px, rgba(0, 0, 0, 0.12) 0px 5px 10px;
    background-color: rgba(217, 217, 217, 0.7);
    border-color: gray;
    border-radius: 9px;
    transition: opacity 0.2s ease-in;
    z-index: 5000;
    visibility: hidden;
    position: absolute;
    width: 25em;
    height: 35em;
    left: 75%;
    bottom: 25%;
    padding: 1em;
    display: block;
    text-align: center;
    margin-top: 2em;
    opacity: 0;
  `;
  cForm.id = "cForm";
  cForm.innerHTML = `
    <div style="
      border-color: gray;
      display: inline-block;
      width: 20em;
      height: 30em;
      text-align: center;
      margin: 1.5em auto;">
      <input class="cFormIn" type="text" id="fname" name="fullname" placeholder="Name">
      <input class="cFormIn" type="text" id="emailAddress" name="email" placeholder="Email address">
      <textarea class="cFormIn" id="subject" name="subject" placeholder="How can we help?" style="height: 200px;"></textarea>
      <button class="cFormSub" onclick="subMail()">Send message</button>
    </div>
  `;
  return cForm;
}

function createContactButton() {
  const cBtnDiv = document.createElement("div");
  cBtnDiv.innerHTML = `
    <button class="demoContactBtn" onclick="contUs()">Fancy a chat?</button>
  `;
  return cBtnDiv;
}

function resetDemoSession() {
  fetch("https://demo.curate.penwern.co.uk/a/frontend/session", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    },
    referrer: "https://demo.curate.penwern.co.uk/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({ AuthInfo: { type: "logout" } }),
    mode: "cors",
    credentials: "include",
  }).then(function () {
    localStorage.clear();
    window.location.href = "https://demo.curate.penwern.co.uk/logout";
  });
}

// Main
window.addEventListener("load", function () {
  initializeDemo();
});


function initializeDemoLogin() {
  const logoStyle = `background-size: contain; background-image: url('${curateLogoURL}'); background-position: center center; background-repeat: no-repeat; position: absolute; top: 183px; left: 42%; width: 320px; height: 120px;'`;
  const logoElement = document.createElement("div");
  logoElement.style = logoStyle;

  const dialogRootBlur = document.getElementsByClassName("dialogRootBlur");
  const firstDialog = dialogRootBlur.item(0);

  if (firstDialog.innerText.includes("Enter your email address and password")) {
    firstDialog.appendChild(logoElement);

    const secondDialog = dialogRootBlur.item(1);
    secondDialog.style.opacity = "0";
    secondDialog.style.pointerEvents = "none";

    const loginForm = createLoginForm();
    firstDialog.appendChild(loginForm);
  }
}

function createLoginForm() {
  const loginFormContainer = document.createElement("div");
  loginFormContainer.style = `
    position: absolute;
    left: auto;
    top: auto;
    width: 30em;
    height: 25em;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0.8;
    border-radius: 2px;
    padding: 2em;
    color: white;
    display: inline-block;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px;
    z-index: 2000;
  `;
  loginFormContainer.id = "loginForm";

  const welcomeHeader = document.createElement("span");
  welcomeHeader.style = "color: white; font-size: 16pt; display: inline-block; margin-bottom: 1em;";
  welcomeHeader.innerText = "Welcome to Curate";

  const descriptionSpan = document.createElement("span");
  descriptionSpan.style = "font-size: 12pt; display: inline-block;";
  descriptionSpan.innerText = "This demo will reset itself every hour. Please feel free to upload and edit files as you wish and the data will be cleared shortly. Click below to sign in and try it out.";

  const creditLink = document.createElement("a");
  creditLink.style = "font-size: 12pt; display: inline-block;";
  creditLink.href = "https://pydio.com/en/pydio-cells/overview";
  creditLink.innerText = "Built on the open-source platform Pydio Cells.";

  const loginButton = createLoginButton();

  loginFormContainer.appendChild(welcomeHeader);
  loginFormContainer.appendChild(descriptionSpan);
  loginFormContainer.appendChild(creditLink);
  loginFormContainer.appendChild(loginButton);

  return loginFormContainer;
}

function createLoginButton() {
  const loginButton = document.createElement("div");
  loginButton.classList.add("demoLaunchBtn");
  loginButton.onclick = function () {
    document.querySelector("#application-login").value = "demo";
    document.querySelector("#application-password").value = "D3moUser!";
    document.querySelector("#dialog-login-submit").click();
  };

  const accountIcon = document.createElement("span");
  accountIcon.className = "mdi mdi-account";
  accountIcon.style = "position:relative; top:-0.1em;font-size: 60px; margin-bottom: 10px;";

  const accountLabel = document.createElement("span");
  accountLabel.style = "text-align: center; font-size: 12pt; position: relative; top: -0.1em;";
  accountLabel.innerText = "Demo User";

  loginButton.appendChild(accountIcon);
  loginButton.appendChild(accountLabel);

  return loginButton;
}

function initializeModule() {
  if (pydio) {
    if (!document.querySelector("#pydio-demo-death-counter")) {
      if ((pydio.getFrontendUrl().pathname === "/login" || pydio.getFrontendUrl().pathname === "/") && !pydio.user) {
        setTimeout(function () {
          initializeDemoLogin();
          initializeDemo();
          clearInterval(window.demoTimerInterval);
        }, 200);
      } else if (pydio.user && !document.querySelector("#pydio-demo-death-counter")) {
        initializeDemo();
        clearInterval(window.demoTimerInterval);
      }
    }
  }
}

// Main
window.addEventListener("load", function () {
  window.demoTimerInterval = setInterval(initializeModule, 300);
});
