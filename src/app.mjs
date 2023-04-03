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
app.set('views', path.join(__dirname, 'views'));
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

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/login")
  };
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
                    res.render('login',{title:'Login', message:"Username or Password was incorrect" })
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

app.get('/platform',checkAuthenticated ,async (req, res) => {
    res.render('platform',{title:'Platform',user:req.user});
  });

app.get('/changepwd',checkAuthenticated ,async (req, res) => {
    res.render('changepwd',{title:'Change My Password',user:req.user});
  });

app.post('/changepwd',async (req, res) => {
    if (!req.body.original_pwd) {
        res.render('changepwd',{title:'Change My Password', message: "Orginal password was not given",user:req.user})
    }
    else if (!req.body.new_pwd) {
        res.render('changepwd',{title:'Change My Password', message: "New password was not given",user:req.user})
    }
    else{
        try {
            const user = await User.findOne({ username: req.user.username });
            user.changePassword(req.body.original_pwd, req.body.new_pwd, function(err) {
                if(err) {
                         if(err.name === 'IncorrectPasswordError'){
                             res.render('changepwd',{title:'Change My Password', message:'Your original password is incorrect!',user:req.user});
                         }else {
                             res.render('changepwd',{title:'Change My Password', message:'Something went wrong! Try again later.',user:req.user});
                         }
               } else {
                 res.render('changepwd',{title:'Change My Password', message:'Your password has been changed successfully.',user:req.user});
                }
        }
        )} catch (err) {
            res.render('changepwd',{title:'Change My Password', message:err,user:req.user});
        }
    }
  });
app.get('/changeusername',checkAuthenticated ,async (req, res) => {
    res.render('changeusername',{title:'Change My Username',user:req.user});
  });

app.post('/changeusername',checkAuthenticated ,async (req, res) => {
    if (!req.body.new_username) {
        res.render('changeusername',{title:'Change My Username', message: "New Username was not given",user:req.user})
    }
    else{
        const newname = req.body.new_username;
        const check = await User.findOne({ username: newname });
        if (check){
            res.render('changeusername',{title:'Change My Username', message: "This username has already existed!",user:req.user})
        }
        else{
            const user = await User.findOne({ username: req.user.username });
            user.username = newname;
            await user.save()
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.render('changeusername',{title:'Change My Username',user:user,message:'Your username has been changed successfully.'});
              });
        }
    }
  });

app.get('/changecontact',checkAuthenticated ,async (req, res) => {
    res.render('changecontact',{title:'Change My Contact',user:req.user});
  });

app.post('/changecontact',checkAuthenticated ,async (req, res) => {
    if (!req.body.new_contact) {
        res.render('changecontact',{title:'Change My Contact', message: "New Contact was not given",user:req.user})
    }
    else{
        const user = await User.findOne({ username: req.user.username });
        user.contact = req.body.new_contact;
        await user.save()
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.render('changecontact',{title:'Change My Contact',user:user,message:'Your contact has been changed successfully.'});
            });
    }
  });

app.get('/logout', async function(req, res,next) {
  req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
  });

app.listen(process.env.PORT || 3000);
