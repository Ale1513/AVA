let message = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis;

function populateVoiceList(str) {
  voices = synth.getVoices();

  let selectedVoice = voices.find(function(voice) {
    return voice.name === 'Microsoft Elsa - Italian (Italy)';
  });

  if (selectedVoice) {
    message.voice = selectedVoice;
    message.rate = 1.3; 
    if(str==null || typeof(str) == 'Event') 
    {str=" ";}
    console.log(str);
    message.text = str;
    window.speechSynthesis.speak(message);
  } else {
    console.log("Voce 'Microsoft Elsa' non trovata.");
  }
}


//------------------------------------------------------------
let nTocchi=0;        
let map;
const weekday = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];

function myFunction() {
  let x = document.getElementById("menu");
  if (x.className === "mymenu") {
    x.className += " responsive";
  } else {
    x.className = "mymenu";
  }
}

function answer(e){
  let answers = document.getElementById('answer');
  let typewriter = new Typewriter(answers, {
    loop: false,
    delay: 49.5,
    typeSpeed: 1,
  });
  typewriter.typeString(e)
    .pauseFor(1)
    .start();
  document.getElementById("contentAnswer").style.backgroundColor="#0067ac4f";
  if(e!="Ciao, sono Ava (AVA Virtual Assistant), cosa posso fare per te?"){
    populateVoiceList(e);
  }
}
//---------start---------------------------------
  function onSound() {
    if (nTocchi % 2 == 0) {
      testo = document.getElementById("txtUtente").value;
      document.getElementById("logo").src = "../img/logoSound.gif";
      document.getElementById("txtUtente").style.display = "none";
      document.getElementById("btnUtente").value = "Stop";
 //----------------------------------mappa---------------------------------------------------- 
        if (document.getElementById("txtUtente").value.toLowerCase().includes('cerca nelle vicinanze') && 
        !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
        !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
          let tag_amenity = '';
          if (testo.includes("ristoranti") || testo.includes("ristorante")) {
            tag_amenity = 'restaurant';
          }
          if (testo.includes("alberghi") || testo.includes("albergo")) {
            tag_amenity = 'hotel';
          }
          if (testo.includes("ospedali") || testo.includes("ospedale")) {
            tag_amenity = 'hospital';
          }
          if (testo.includes("bar")) {
            tag_amenity = 'bar';
          }
          if (testo.includes("stazioni degli autobus") || testo.includes("stazione degli autobus")) {
            tag_amenity = 'bus_station';
          }
          if (testo.includes("benzina")) {
            tag_amenity = 'fuel';
          }
          if (testo.includes("parcheggi") || testo.includes("parcheggio")) {
            tag_amenity = 'parking';
          }
          if (testo.includes("farmacie") || testo.includes("farmacia")) {
            tag_amenity = 'pharmacy';
          }
          if (testo.includes("cinema")) {
            tag_amenity = 'cinema';
          }
          if (document.getElementById("map") && !document.getElementById("map").hasChildNodes()) {
            document.getElementById("map").style.height="400px";
            map = L.map('map').setView([44.8015, 10.3279], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
              maxZoom: 18,
            }).addTo(map);
          }
          navigator.geolocation.getCurrentPosition(function(position) {
        
            answer("Ecco la risposta alla tua richiesta...");
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let currentLocationMarker = L.circle([lat, lon], {
              radius: 100, // specifica il raggio del cerchio in metri
              color: 'red', // specifica il colore del cerchio
              fillColor: 'red', // specifica il colore di riempimento del cerchio
              fillOpacity: 0.5 // specifica l'opacità del riempimento del cerchio
            }).addTo(map);
            currentLocationMarker.bindPopup("La mia posizione");
            let serviziUrl = "https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=" + tag_amenity + "](around:10000," + lat + "," + lon + ");out;";
            fetch(serviziUrl)
              .then(response => response.json())
              .then(data => {
                for (let i = 0; i < data.elements.length; i++) {
                  let servizio = data.elements[i];
                  let marker = L.marker([servizio.lat, servizio.lon]).addTo(map);
                  marker.bindPopup(servizio.tags.name);
                }
              });           

          }, function(error) {
            console.log("Errore durante la geolocalizzazione: ", error);
          });

        }
      
       //----------------------------------promemoria---------------------------------------------------- 

      else if (document.getElementById("txtUtente").value.toLowerCase().includes('promemoria:') && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        const data = Date.now();
        let oggi=new Date(data);
        let dataCompleta= (oggi.getFullYear() +"/"+ (oggi.getMonth()+1)+"/"+ oggi.getDate());
        let socket = io();
        let testo = dataCompleta + " - "+ document.getElementById("txtUtente").value.slice(12); 
        socket.emit('newPromemoria', testo);
        socket.on('newPromemoria', function() {
          let stringa = "Promemoria inserito correttamente";
          answer(stringa);
        });

      }
       //----------------------------------CADEL MA SI RIALZA---------------------------------------------------- 

      else if (document.getElementById("txtUtente").value.toLowerCase().includes('cadel') && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        let stringa = "CADEL EVANS - IL MIGLIOR CICLISTA DEL MONDO!";
        answer(stringa);
      }
       //----------------------------------saluto---------------------------------------------------- 

      else if (document.getElementById("txtUtente").value.toLowerCase().includes('ciao') && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        let stringa = "";
        const currentHour = new Date().getHours();
        if (currentHour < 13) {
          stringa = "Buongiorno! Come posso esserti utile?";
        } else if (currentHour < 18) {
          stringa = 'Buon pomeriggio. Come posso esserti utile?';
        } else {
          stringa = 'Buonasera. Come posso esserti utile?';
        }
        answer(stringa);
      } 
       //----------------------------------barzelletta---------------------------------------------------- 

      else if (document.getElementById("txtUtente").value.toLowerCase().includes("barzelletta") || document.getElementById("txtUtente").value.includes("barzellette") && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api-barzellette.vercel.app/api/barzellette');
        xhr.onload = function() {
          if (xhr.status === 200) {
            let dati = JSON.parse(xhr.responseText);
            console.log(dati);
            let random = Math.floor(Math.random() * dati.length);
            answer(dati[random].frase);
          } else {
            console.log('Errore nella richiesta');
          }
        };
        xhr.send();
      } 
 //----------------------------------ricette---------------------------------------------------- 

      else if (document.getElementById("txtUtente").value.toLowerCase().includes("ricetta") || document.getElementById("txtUtente").value.includes("ricette") && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api-ricette.vercel.app/api/ricette');
        xhr.onload = function() {
          if (xhr.status === 200) {
            let dati = JSON.parse(xhr.responseText);
            console.log(dati);
            if(testo.includes("primo")){
              let random = Math.floor(Math.random() * 19);
              answer("Ecco cosa ho pensato per te: "+ dati[random].ricetta);
            }
            else if(testo.includes("secondo")){
              let random = Math.floor(Math.random() * (39 - 21) + 21);              
              answer("Ecco cosa ho pensato per te: "+ dati[random].ricetta);
            }
            else if((testo.includes("dolce"))|| (testo.includes("dessert"))){
              let random = Math.floor(Math.random() * (59 - 39) + 39);              
              answer("Ecco cosa ho pensato per te: "+ dati[random].ricetta);
            }
            else{
              let random = Math.floor(Math.random() * dati.length);            
              answer("Ecco cosa ho pensato per te: "+ dati[random].ricetta);
            }
            
          } else {
            console.log('Errore nella richiesta');
          }
        };
        xhr.send();
      } 
 //----------------------------------meteo---------------------------------------------------- 

      else if (document.getElementById("txtUtente").value.toLowerCase().includes("meteo") && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          let xhr = new XMLHttpRequest();
          xhr.open('GET', `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=apparent_temperature_max,apparent_temperature_min,precipitation_probability_mean&timezone=CET`);
          xhr.onload = function() {
            if (xhr.status === 200) {
              let str='';
              let dati = JSON.parse(xhr.responseText);
              console.log(dati);
              console.log("ciao")
              for(let i=0;i<dati.daily.time.length;i++){
                if(testo.includes("oggi") && i==1){
                  break
                }
                let d = new Date(dati.daily.time[i]);
                str += '<b>';
                str += "Data: " + dati.daily.time[i] +  " - "+ weekday[d.getDay()];
                str += '</b><br>';
                str += "Massima: " + dati.daily.apparent_temperature_max[i] + "°C";
                str += '<br>';
                str += 'Minima: ' + dati.daily.apparent_temperature_min[i] + "°C";
                str += '<br>';
                str += 'Probabilità precipitazioni: ' + dati.daily.precipitation_probability_mean[i] + "%";
                str += '<br><hr><br>';
                console.log("ciao1")
                
              }
              openBigModaleMeteo(str);
            } 
            else {
              console.log('Errore nella richiesta');
            }
          };
          xhr.send();  
        })
        
      }
       //----------------------------------info---------------------------------------------------- 

      else if((document.getElementById("txtUtente").value.toLowerCase().includes("chi sei?"))|| (document.getElementById("txtUtente").value.toLowerCase().includes("presentati")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))){
        answer("Ciao, sono Ava (AVA Virtual Assistant) e sono un'assistente virtuale. I miei creatori sono due ragazzi: Alessia Sirianni e Edoardo Zambernardi. Nonostante al momento io possa svolgere solo alcune funzionalità, sono costantemente aggiornata per migliorare le mie capacità e fornirti un'esperienza sempre più completa. Spero di esserti utile e ti ringrazio  per aver scelto di interagire con me e per la tua pazienza mentre mi miglioro costantemente.")
      }
      
       //----------------------------------notizie---------------------------------------------------- 

      else if ((document.getElementById("txtUtente").value.toLowerCase().includes("notizia"))||(document.getElementById("txtUtente").value.toLowerCase().includes("notizie")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduci")) && 
      !(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        let socket = io();
        socket.emit('news', testo);
        socket.on('news', function(dati) {
          const articles = dati.articles;
          let str = '';
          const latestArticles = articles.slice(0, 10);
          latestArticles.forEach(article => {
            let a= article.url;
            console.log(a);
            str += article.title;
            str += '<br>';
            str += `<a href=${a}>Leggi altro..</a>`
            str += '<br><br>';
            str += '<hr>';
            str += '<br><br>';
          });
          openBigModale(str);         
        });
      }
       //----------------------------------traduzione---------------------------------------------------- 

      else if ((document.getElementById("txtUtente").value.toLowerCase().includes("traduci"))||(document.getElementById("txtUtente").value.toLowerCase().includes("traduzione"))) {
        let socket = io();
        socket.emit('traduzione', testo);
        socket.on('traduzione', function(trad) {
          openBigModale(trad);         
        });
      }

      else {
        answer("Spiacente, credo di non aver capito bene.");
      }
  
      document.getElementById("txtUtente").value = '';
      nTocchi++;
    } else {
      if (map) {
        map.remove();
      }
      document.getElementById("map").style.height="1px";
     // document.getElementById("mapCont").className="hidden";
      document.getElementById("logo").src = "../img/logoSemplice.png";
      window.speechSynthesis.cancel();
      document.getElementById("contentAnswer").style.backgroundColor = "white";
      document.getElementById("answer").innerText = " ";
      document.getElementById("txtUtente").style.display = "initial";
      document.getElementById("btnUtente").value = "Invia";
      nTocchi--;
    }
  }
  
function chiSono1(){
  let testoCiao="Ciao, sono Ava (AVA Virtual Assistant), cosa posso fare per te?";
  answer(testoCiao)
}



function caricaProm(){
  let socket = io();

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
//-----------------login----------------------------------------
function goLogin(){
  document.getElementById("logSign").className="hidden";
  document.getElementById("template-log").className="visible";
}

function goSignUp(){
  document.getElementById("logSign").className="hidden";
  document.getElementById("template-Sign").className="visible";
}
//--------------------logout----------------------------------------
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
//-------------modali-------------------------------------
function openBigModale(e){
  answer("Ecco la risposta alla tua richiesta...");
  document.getElementById("testo").className="visisble";
  document.getElementById("testo").className="visisble";
  document.getElementById("modal-content2").style.width = "40%";
  document.getElementById("modal-content2").style.height = "70%";
  document.getElementById("modal-content2").style.top = "0%";
  setTimeout(function(){ document.getElementById("myModal2").style.display = "block";}, 3000);
  const para = document.createElement("h3");
  para.innerHTML = e;
  document.getElementById("testo").appendChild(para);  
  document.getElementById("testo").style.height = "85%";
  document.getElementById("testo").style.textAlign="left";
}
function openBigModaleMeteo(e){
  answer("Ecco la risposta alla tua richiesta...");
  document.getElementById("testo").className="visisble";
  document.getElementById("modal-content2").style.width = "25%";
  document.getElementById("modal-content2").style.height = "30%";
  document.getElementById("modal-content2").style.top = "20%";
  setTimeout(function(){ document.getElementById("myModal2").style.display = "block";}, 3000);
  const para = document.createElement("p");
  para.innerHTML = e;
  document.getElementById("testo").appendChild(para);  
  document.getElementById("testo").style.textAlign="center";
  document.getElementById("testo").style.height = "70%";

  
}
function closeBigModale(){
  document.getElementById("myModal2").style.display = "none";
  document.getElementById("testo").innerHTML='';
  document.getElementById("testo").className="hidden";
  document.getElementById("map").innerHTML='';
}