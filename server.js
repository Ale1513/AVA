const http = require("http");                  
const express = require('express');  
const mysql = require('mysql');   
const bcrypt = require('bcryptjs');   
const jwt = require('jsonwebtoken');                                                 
const app = express();            
const server1 = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server1);

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
    loginUser(us, p, function(result){
      if(result){
        console.log("OK");
        socket.emit('login',null,null);
      }
      else{
        console.log("Errore");
      }
    })  
  });
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