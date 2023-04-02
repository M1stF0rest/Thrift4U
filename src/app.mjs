import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import './db.mjs';
import mongoose from 'mongoose';
import session from 'express-session';
import url from 'url';
import exphbs from 'express-handlebars';
import passport from 'passport';
import LocalStrategy from 'passport-local';
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'Manchester United will be the European Champion',
    resave: false,
    saveUninitialized: true,
}));
// using passport library for authentication
app.use(passport.initialize()); 
app.use(passport.session());
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// const auth = passport.authenticate('local', { failureRedirect: '/login', failureMessage: true });
// ===================
//     ROUTES
// ===================

app.get('/', async (req, res) => {
    res.render('home',{title:'Homepage',layout:'homelayout'});
  });

app.get('/login', async (req, res) => {
    res.render('login',{title:'Login',layout:'layout'});
  });

app.post('/login',(req, res,next) => {
    if (!req.body.username) {
        res.render('login',{title:'Login', message: "Username was not given" })
    }
    else if (!req.body.password) {
        res.render('login',{title:'Login', message: "Password was not given" })
    }
    else {
       passport.authenticate("local", function (err, user, info) {
            if (err) {
                res.render('login',{title:'Login', message: err })
            }
            else {
                if (!user) {
                    res.render('login',{title:'Login', message:"username or password incorrect" })
                }
                else {
                    req.login(user, function(err) {
                        if (err) { return next(err); }
                        return res.redirect('/platform');
                      });       
                }
            }
        })(req,res);
    }
  });

app.get('/register', async (req, res) => {
    res.render('register',{title:'Register',layout:'layout'});
  });

app.post('/register', async(req, res) => {
    const newUser=new User({contact: req.body.register_contact, username : req.body.register_name});
    User.register(newUser, req.body.register_password, function(err, user){
        if (err){
            console.log(err.message);
            res.render('register',{title:'Register',message:err.message});
        }
        else{
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/platform');
              });
        }
    });
  });

app.get('/platform',async (req, res) => {
    res.render('platform',{title:'Platform',user:req.user});
  });

app.get('/logout', async function(req, res,next) {
  req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
  });

app.listen(process.env.PORT || 3000);
