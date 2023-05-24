var message = new SpeechSynthesisUtterance();
message.text = "Il tuo messaggio da pronunciare";

// Recupero dell'elenco delle voci
var voices = speechSynthesis.getVoices();

// Seleziona la voce di donna
var selectedVoice = voices.find(function(voice) {

  return voice.lang === 'it-IT' && voice.name.includes('Female'); // Esempio: voce italiana di donna
});
  console.log(speechSynthesis.getVoices());
// Imposta la voce nell'oggetto SpeechSynthesisUtterance
message.voice = selectedVoice;

// Riproduzione del messaggio
window.speechSynthesis.speak(message);
//---------------------
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

  function onSound() {
    if (nTocchi % 2 == 0) {
      testo = document.getElementById("txtUtente").value;
      document.getElementById("logo").src = "../img/logoSound.gif";
      document.getElementById("txtUtente").style.display = "none";
      document.getElementById("btnUtente").value = "Stop";
  
      if (document.getElementById("txtUtente").value.includes("ristoranti") || document.getElementById("txtUtente").value.includes("alberghi") || document.getElementById("txtUtente").value.includes("ospedali")) {
        var tag = '';
        var tag_amenity = '';
        if (document.getElementById("txtUtente").value.includes("ristoranti")) {
          tag = 'ristoranti';
          tag_amenity = 'restaurant';
        }
        if (document.getElementById("txtUtente").value.includes("alberghi")) {
          tag = 'alberghi';
          tag_amenity = 'hotel';
        }
        if (document.getElementById("txtUtente").value.includes("ospedali")) {
          tag = 'ospedali';
          tag_amenity = 'hospital';
        }
  
        if (document.getElementById("txtUtente").value.toLowerCase().includes(`cerca nelle vicinanze: ${tag}`)) {
          if (document.getElementById("map") && !document.getElementById("map").hasChildNodes()) {
            map = L.map('map').setView([44.8015, 10.3279], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
              maxZoom: 18,
            }).addTo(map);
          }
          navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById("mapCont").className="visisble";
            //document.getElementById("map").style.display = "block";
            answer("Ecco cosa ho trovato...");
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var serviziUrl = "https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=" + tag_amenity + "](around:10000," + lat + "," + lon + ");out;";
            fetch(serviziUrl)
              .then(response => response.json())
              .then(data => {
                for (var i = 0; i < data.elements.length; i++) {
                  var servizio = data.elements[i];
                  var marker = L.marker([servizio.lat, servizio.lon]).addTo(map);
                  marker.bindPopup(servizio.tags.name);
                }
              });           
               //openBigModale2();

          }, function(error) {
            console.log("Errore durante la geolocalizzazione: ", error);
          });

        }
      }
      
      else if (document.getElementById("txtUtente").value.toLowerCase().includes('promemoria:')) {
        const data = Date.now();
        let oggi=new Date(data);
        let dataCompleta= (oggi.getFullYear() +"/"+ (oggi.getMonth()+1)+"/"+ oggi.getDate());
        var socket = io();
        let testo = dataCompleta + " - "+ document.getElementById("txtUtente").value.slice(12); 
        socket.emit('newPromemoria', testo);
        socket.on('newPromemoria', function() {
          let stringa = "Promemoria inserito correttamente";
          answer(stringa);
        });

      }
      
      else if (document.getElementById("txtUtente").value.toLowerCase().includes('cadel')) {
        let stringa = "CADEL EVANS - IL MIGLIOR CICLISTA DEL MONDO!";
        answer(stringa);
      }
      
      else if (document.getElementById("txtUtente").value.toLowerCase().includes('ciao')) {
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
      
      else if (document.getElementById("txtUtente").value.toLowerCase().includes("barzelletta") || document.getElementById("txtUtente").value.includes("barzellette")) {
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
      else if (document.getElementById("txtUtente").value.toLowerCase().includes("ricetta") || document.getElementById("txtUtente").value.includes("ricette")) {
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

      else if (document.getElementById("txtUtente").value.toLowerCase().includes("meteo")) {
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
              for(let i=0;i<dati.daily.time.length;i++){
                if(testo.includes("oggi") && i==1){
                  break
                }
                str += '<b>';
                str += "Data: " + dati.daily.time[i];
                str += '</b><br>';
                str += "Massima: " + dati.daily.apparent_temperature_max[i] + "°C";
                str += '<br>';
                str += 'Minima: ' + dati.daily.apparent_temperature_min[i] + "°C";
                str += '<br>';
                str += 'Probabilità precipitazioni: ' + dati.daily.precipitation_probability_mean[i] + "%";
                str += '<br><hr><br>';
                
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
      
      else if((document.getElementById("txtUtente").value.toLowerCase().includes("chi sei?"))|| (document.getElementById("txtUtente").value.toLowerCase().includes("presentati"))){
        answer("Ciao, sono Ava (AVA Virtual Assistant) e sono un'assistente virtuale. I miei creatori sono due ragazzi: Alessia Sirianni e Edoardo Zambernardi. Nonostante al momento io possa svolgere solo alcune funzionalità, sono costantemente aggiornata per migliorare le mie capacità e fornirti un'esperienza sempre più completa. Spero di esserti utile e ti ringrazio  per aver scelto di interagire con me e per la tua pazienza mentre mi miglioro costantemente.")
      }
      
      else if ((document.getElementById("txtUtente").value.toLowerCase().includes("notizia"))||(document.getElementById("txtUtente").value.toLowerCase().includes("notizie"))) {
        let socket = io();
        socket.emit('news');
        socket.on('news', function(dati) {
          const articles = dati.articles;
          let str = '';
          const latestArticles = articles.slice(0, 5);
          latestArticles.forEach(article => {
            let a= article.url;
            console.log(a);
            str += article.title;
            str += '<br>';
            str += `<a href=${a}>Leggi altro..</a>`
            str += '<br><br>';
            str += '<hr>';
            str += '<br><br>';
            //str += article.url;
            //str += '<br><br>';
          });
          openBigModale(str);         
      });

      } else {
        answer("Spiacente, credo di non aver capito bene.");
      }
  
      document.getElementById("txtUtente").value = '';
      nTocchi++;
    } else {
      if (map) {
        map.remove();
      }
      document.getElementById("mapCont").className="hidden";
      document.getElementById("logo").src = "../img/logoSemplice.png";
      document.getElementById("contentAnswer").style.backgroundColor = "white";
      document.getElementById("answer").innerText = " ";
      document.getElementById("txtUtente").style.display = "initial";
      document.getElementById("btnUtente").value = "Invia";
      nTocchi--;
    }
  }
  
function chiSono1(){
  answer("Ciao, sono Ava (AVA Virtual Assistant), cosa posso fare per te?")
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

function openBigModale(e){
  answer("Ecco cosa ho trovato...");
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
  answer("Ecco cosa ho trovato...");
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