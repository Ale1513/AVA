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

function myFunction() {
  var x = document.getElementById("menu");
  if (x.className === "mymenu") {
    x.className += " responsive";
  } else {
    x.className = "mymenu";
  }
}
//------------- cerca ristoranti nelle vicinanze
function answer(e){
  var answers = document.getElementById('answer');

    var typewriter = new Typewriter(answers, {
      loop: false,
      delay: 1,
      typeSpeed: 10,
    });
    typewriter.typeString(e)
      .pauseFor(1)
      .start();
    document.getElementById("contentAnswer").style.backgroundColor="#0067ac4f";
  }

function onSound(){
  if (nTocchi%2==0) 
  {   
    document.getElementById("logo").src="../img/logoSound.gif";
      document.getElementById("txtUtente").style.display="none";
      document.getElementById("btnUtente").value = "Stop";

    //----------------------------CERCA SERVIZI-------------------------------------
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
      
      if(document.getElementById("txtUtente").value.toLowerCase().includes(`cerca nelle vicinanze: ${tag} `)){
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
      
  //----------------------------PROMEMORIA---------------------------------------------
      let txtProm =document.getElementById("txtUtente").value;
      if(txtProm.toLowerCase().includes('promemoria:')){
        var socket = io();
        
        let testo = document.getElementById("txtUtente").value;
        socket.emit('newPromemoria', testo);   

        socket.on('newPromemoria', function() {
         
          let stringa= "Promemoria inserito correttamente";
          
          answer(stringa);
        
        });
      }
      //------------------------CADEL GO-------------------------------------
      let txtCadel =document.getElementById("txtUtente").value;
      if(txtCadel.toLowerCase().includes('cadel')){
          let stringa= "CADEL EVANS - IL MIGLIOR CICLISTA DEL MONDO!";
          answer(stringa);
      }
    
      //-----------------------SALUTO--------------------------------------
      let txtCiao =document.getElementById("txtUtente").value;
      if(txtCiao.toLowerCase().includes('ciao')){
        let stringa = "";
        const currentHour = new Date().getHours();

        if (currentHour < 13) {
          stringa = "Buongiorno! Come posso esserti utile?"; 
        } 
        else if (currentHour < 18) {
          stringa = 'Buon pomeriggio. Come posso esserti utile?';
        } 
        else {
          stringa = 'Buonasera. Come posso esserti utile?';
        }
        answer(stringa);
      
      }

      //--------------------BARZELLETTE------------------------------------
      let txtBarz =document.getElementById("txtUtente").value;
      if(txtBarz.toLowerCase().includes("barzelletta") || txtBarz.includes("barzellette")){
        let xhr = new XMLHttpRequest(); // creare un oggetto XMLHttpRequest
        xhr.open('GET', 'https://api-barzellette.vercel.app/api/barzellette'); // impostare la richiesta GET all'endpoint specificato
        xhr.onload = function() { // quando i dati sono stati caricati correttamente
            if (xhr.status === 200) { // se lo stato della risposta è OK
                let dati = JSON.parse(xhr.responseText); // converte i dati JSON in un oggetto JavaScript
                console.log(dati); // visualizza i dati in console
                let random = Math.floor(Math.random() * dati.length);
                answer(dati[random].frase);
            } 
            else {
                console.log('Errore nella richiesta'); // visualizza un messaggio di errore
            }
        };
        xhr.send();
      }
     

      //----------------------BREAKING NEWS--------------------------------------------
      let txtNot =document.getElementById("txtUtente").value;
      if(txtNot.toLowerCase().includes("notizie")){
        let apiKey = "fdbea0c447134ad789845af9496a997a";
        const url = `https://newsapi.org/v2/top-headlines?country=it&apiKey=${apiKey}`;
        let xhr = new XMLHttpRequest(); // creare un oggetto XMLHttpRequest
        xhr.open('GET', url); // impostare la richiesta GET all'endpoint specificato
        xhr.onload = function() { // quando i dati sono stati caricati correttamente
            if (xhr.status === 200) { // se lo stato della risposta è OK
                let dati = JSON.parse(xhr.responseText); // converte i dati JSON in un oggetto JavaScript
                console.log(dati); // visualizza i dati in console
                const articles = dati.articles;
                let str = '';
                const latestArticles = articles.slice(0, 5);
                latestArticles.forEach(article => {
                  str += article.title;
                  str += '<br>';
                  str += article.url;
                  str += '<br><br>';
                });
                answer(str);
            } 
            else {
                console.log('Errore nella richiesta'); // visualizza un messaggio di errore
            }
        };
        xhr.send();
      }
      else{
        answer("Spiacente, credo di non aver capito bene. ")
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


      document.getElementById("contentAnswer").style.backgroundColor="white";
      document.getElementById("answer").innerText=" ";
      document.getElementById("txtUtente").style.display="initial";
      document.getElementById("btnUtente").value = "Invia";
      nTocchi--;
  }
}

/*function chiSono(){
  let answers = document.getElementById('answer');

  var typewriter = new Typewriter(answers, {
    loop: true,
    typeSpeed: 10,
    delay: 50,
    deleteSpeed: 10
  });
  typewriter.typeString("Ciao, sono Ava (AVA Virtual Assistant) e sono un'assistente virtuale. I miei creatori sono due ragazzi: Alessia Sirianni e Edoardo Zambernardi. Nonostante al momento io possa svolgere solo alcune funzionalità, sono costantemente aggiornata per migliorare le mie capacità e fornirti un'esperienza sempre più completa. Spero di esserti utile e ti ringrazio  per aver scelto di interagire con me e per la tua pazienza mentre mi miglioro costantemente.")
    .pauseFor(100)
    .start();
  document.getElementById("contentAnswer").style.backgroundColor="#0067ac4f";    
}*/

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