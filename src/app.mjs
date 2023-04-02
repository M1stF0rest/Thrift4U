import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import './db.mjs';
import mongoose from 'mongoose';
import session from 'express-session';
import url from 'url';
import exphbs from 'express-handlebars';
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


app.get('/', async (req, res) => {
    res.render('home',{title:'Homepage',layout:'homelayout'});
  });

app.get('/login', async (req, res) => {
    res.render('login',{title:'Login',layout:'layout'});
  });

app.get('/register', async (req, res) => {
    res.render('register',{title:'Register',layout:'layout'});
  });

app.listen(process.env.PORT || 3000);
