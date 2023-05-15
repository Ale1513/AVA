/*let utterance = new SpeechSynthesisUtterance("Hello world!");
speechSynthesis.speak(utterance);

const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const voiceSelect = document.querySelector("select");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += " — DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

inputForm.onsubmit = (event) => {
  event.preventDefault();

  const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
  synth.speak(utterThis);

  inputTxt.blur();
};
['restaurant', 'hotel', 'hospital', 'bus_station', 'bank', 'pharmacy']*/

var nTocchi=0;

function goLogin(){
  document.getElementById("logSign").className="hidden";
  document.getElementById("template-log").className="visible";
  //document.getElementById("template-Sign").className="hidden";
}

function goSignUp(){
  document.getElementById("logSign").className="hidden";
  document.getElementById("template-Sign").className="visible";
}
//-------------
function openLogout(){
  if (nTocchi%2==0) 
  {
    document.getElementById("dropup-content").className="visible";
    document.getElementById("logout").className="visible";
    nTocchi++;
  }
  else
  {
    document.getElementById("dropup-content").className="hidden";
    document.getElementById("logout").className="hidden";
    nTocchi--;
  }
  
}

function openModale(){
  document.getElementById("myModal").style.display = "block";
}
function closeModal(){  
  document.getElementById("dropup-content").className="hidden";
  document.getElementById("logout").className="hidden";
  document.getElementById("myModal").style.display = "none";
}
function logoutUser(){
  window.location.href= "../index.html";
}