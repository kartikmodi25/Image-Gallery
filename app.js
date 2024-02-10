const mongoose = require('mongoose');
const db = mongoose.connection;
const express = require('express')
const path = require('path');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/login-db');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res)=>{
    res.render('index')
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
})