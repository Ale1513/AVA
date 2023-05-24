const http = require("http");                  
const express = require('express');  
const mysql = require('mysql');   
const bcrypt = require('bcryptjs');  
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; 
const app = express();            
const server1 = http.createServer(app);
const { Server } = require("socket.io");
const { test } = require("node:test");
const io = new Server(server1);

var username;
var password;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'a.v.a'
});

connection.connect((err) => {
  if(err) throw err;
  console.log("Connessione al database riuscita")
});

//-----------------------------------------------

io.on('connection', (socket) => {
  socket.on('signUp', (us, p) => {
      insertNewUser(us, p);
      socket.emit('signUp',null,null);
  });
  socket.on('login', (us, p) => {
    username = us;
    password = p;
    loginUser(us, p, function(result){
      if(result){
        console.log("OK");
        socket.emit('login',null,null);
      }
      else{
        socket.emit('loginErrore',null,null);
        console.log("Errore");
      }
    })  
  });
  socket.on('newPromemoria', (testo) => {
    insertNewPromemoria(username, password, testo);
    socket.emit('newPromemoria');
  });
  socket.on('tuttiProm', () => {
    getPromemoria(username,(err, descriptions) => {
      if (err) {
        console.error('Errore durante il recupero delle descrizioni dei promemoria:', err);
        return;
      }      
      socket.emit('tuttiProm', descriptions);
    });
  });

  socket.on('news', (testo) => {
    let dati;
    let apiKey = "fdbea0c447134ad789845af9496a997a";
    let url;
    if(testo.toLowerCase().includes("italia")){
      url = `https://newsapi.org/v2/top-headlines?country=it&apiKey=${apiKey}`;
    }
    else if(testo.toLowerCase().includes("sport") || testo.toLowerCase().includes("sportive")){
      url = `https://newsapi.org/v2/top-headlines?country=it&category=sports&apiKey=${apiKey}`;
    }
    else if(testo.toLowerCase().includes("cultura") || testo.toLowerCase().includes("spettacolo")){
      url = `https://newsapi.org/v2/top-headlines?country=it&category=entertainment&apiKey=${apiKey}`;
    }
    else if(testo.toLowerCase().includes("tecnologia") || testo.toLowerCase().includes("tecnologiche") || testo.toLowerCase().includes("tecnologico")){
      url = `https://newsapi.org/v2/top-headlines?country=it&category=technology&apiKey=${apiKey}`;
    }
    else if(testo.toLowerCase().includes("scienza") || testo.toLowerCase().includes("scientifico")){
      url = `https://newsapi.org/v2/top-headlines?country=it&category=science&apiKey=${apiKey}`;
    }
    else if(testo.toLowerCase().includes("musica") || testo.toLowerCase().includes("musicale")){
      url = `https://newsapi.org/v2/top-headlines?country=it&category=music&apiKey=${apiKey}`;
    }
    else if(testo.toLowerCase().includes("arte") || testo.toLowerCase().includes("artistico")){
      url = `https://newsapi.org/v2/top-headlines?country=it&category=arts&apiKey=${apiKey}`;
    }
    else{
      url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}`;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        dati = JSON.parse(xhr.responseText);
        //console.log(dati);
        socket.emit('news', dati);
      }
      else {
        console.log('Errore nella richiesta');
      }
    }
    xhr.send();
  })
});

//------------------------------------------------------

function loginUser(valore1, valore2, callback){
  connection.query(`SELECT username, password FROM user WHERE username = '${valore1}'`,
  function(error,results,fields){
    if(error) {
      console.error(error);
      return callback(false);
    }

    if(results.length===0) {
      return callback(false);
    }

    bcrypt.compare(valore2, results[0].password, function(err, match){
      if(err){ 
        console.error(err);
        return callback(false);
      }
      
      if(!match){
        return callback(false);
      }
      return callback(true);
    });
  });
}

async function insertNewUser(valore1, valore2){
  const hash = await bcrypt.hash(valore2, 10);
  const sql = `INSERT INTO user (username, password) VALUES ('${valore1}', '${hash}')`;

  connection.query(sql, (err,result) => {
    if(err) throw err;
    console.log("record inserito");
  });
}

function insertNewPromemoria(valore1, valore2, valore3){
  let userId;
  const queryId = `SELECT idUser FROM user WHERE username = '${valore1}'`;
  
  connection.query(queryId, (err, results) => {
    if (err) throw err;
  
    if (results.length > 0) {
      console.log(results);
      userId = results[0].idUser;
      console.log('ID utente:', userId);
  
      const queryInsert = `INSERT INTO promemoria (descrizione, idUser) VALUES ('${valore3}', ${userId})`;
      connection.query(queryInsert, (err, results) => {
        if (err) throw err;
        console.log("record inserito");
      });
  
    } else {
      console.log('Utente non trovato');
    }
  });
}

function getPromemoria(valore1,callback){
  const queryProm = `SELECT promemoria.descrizione FROM user INNER JOIN promemoria ON user.idUser = promemoria.idUser WHERE user.username = '${valore1}'`;
  connection.query(queryProm, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    const testi = results.map((row) => row.descrizione);
    callback(null, testi);
  });
}

//----------------------------------------------------------

server1.listen(3000, function() {
    console.log("Server avviato sulla porta 3000")
});
app.get('/css/style.css', (req, res) => {
	res.sendFile(__dirname + '/css/style.css');
});
app.get('/index.html', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/js/script.js', (req, res) => {
	res.sendFile(__dirname + '/js/script.js');
});
app.use('/img', express.static(__dirname + '/img'));
app.use('/pag_html', express.static(__dirname + '/pag_html'));