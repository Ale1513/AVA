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
var map;
/*var username = document.getElementById("emailLog").value;
var password = document.getElementById("pswLog").value;
console.log(username);
console.log(password);*/

//------------- cerca ristoranti nelle vicinanze
function onSound(){
  if (nTocchi%2==0) 
  {
      var tag = '';
      var tag_amenity = '';
      if(document.getElementById("txtUtente").value.includes("ristoranti")){
          tag = 'ristoranti';
          tag_amenity = 'restaurant';
      }
      if(document.getElementById("txtUtente").value.includes("alberghi")){
          tag = 'alberghi';
          tag_amenity = 'hotel';
      }
      if(document.getElementById("txtUtente").value.includes("ospedali")){
          tag = 'ospedali';
          tag_amenity = 'hospital';
      }
      document.getElementById("logo").src="../img/logoSound.gif";
      document.getElementById("txtUtente").style.display="none";
      document.getElementById("btnUtente").value = "Stop";
      if(document.getElementById("txtUtente").value.includes(`cerca ${tag} nelle vicinanze`)){
          if (document.getElementById("map") && !document.getElementById("map").hasChildNodes()) {
              map = L.map('map').setView([44.8015, 10.3279], 13);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                  maxZoom: 18,
              }).addTo(map);
          }
          // Otteniamo la posizione corrente dell'utente
          navigator.geolocation.getCurrentPosition(function(position) {
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;
              // Costruiamo l'URL per cercare i ristoranti vicini alle coordinate ottenute
              var serviziUrl = "https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=" + tag_amenity + "](around:10000," + lat + "," + lon + ");out;";
              // Eseguiamo la richiesta per ottenere i ristoranti
              fetch(serviziUrl)
              .then(response => response.json())
              .then(data => {
                  // Aggiungiamo i marker sulla mappa per ogni ristorante trovato
                  for (var i = 0; i < data.elements.length; i++) {
                  var servizio = data.elements[i];
                  var marker = L.marker([servizio.lat, servizio.lon]).addTo(map);
                  marker.bindPopup(servizio.tags.name);
                  }
              })
          }, function(error) {
              console.log("Errore durante la geolocalizzazione: ", error);
          });
      }
  //-------------------------------------------------------------------------
      if(document.getElementById("txtUtente").value.includes('promemoria')){
        var socket = io();

        let testo = document.getElementById("txtUtente").value;
        socket.emit('newPromemoria', testo);   

        socket.on('newPromemoria', function() {
          document.getElementById("answer").innerText = "Promemoria inserito correttamente";
        });
      }

      document.getElementById("txtUtente").value='';
      nTocchi++;
    
  }

  else
  {
      document.getElementById("logo").src="../img/logoSemplice.png";
      if (map) {
          map.remove();
      }
      document.getElementById("txtUtente").style.display="initial";
      document.getElementById("btnUtente").value = "Invia";
      nTocchi--;
  }
}

function caricaProm(){
  var socket = io();

  socket.emit('tuttiProm');   
  socket.on('tuttiProm', function(descriptions) {
    const ulElement = document.createElement('ul');
      descriptions.forEach((description) => {
        const liElement = document.createElement('li');
        liElement.textContent = description;
        ulElement.appendChild(liElement);
    });
    document.getElementById("listaProm").appendChild(ulElement);
  });
}

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