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

function removeProperties(obj) {
    Object.keys(obj).forEach(function(key) {
      if (obj[key] === ''|| obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }
// Function to prompt the user for confirmation
function promptForConfirmation(message) {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
}
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
  const queryobject = {};
  if (req.query.itemname){
    queryobject.name = {$regex : req.query.itemname};
  }
  queryobject.category = req.query.category;
  queryobject.range = req.query.range;
  Item.find(queryobject?removeProperties(queryobject):null)
    .populate('seller',)
    .then(function (found){
      if (req.query.sellername){
        found = found.filter(item => item.seller.username.includes(req.query.sellername));
      }
      res.render('platform',{title:'Platform',user:req.user,found:found})
    })
    .catch((err) => res.status(500).send(err));
  });

app.post('/postmyitem',checkAuthenticated ,async (req, res) => {
    const description = req.body.description?req.body.description:"";
    const image= req.body.image?req.body.image:"";
    let range = ''
    if (req.body.price < 10){
      range = 'Below 10';
    }
    else if (req.body.price <50 ){
      range = '10 - 49';
    }
    else if(req.body.price < 100){
      range = '50 - 99';
    }
    else if(req.body.price < 200){
      range = '100 - 199';
    }
    else{
      range = 'Above 200';
    }
    const item = new Item({
      seller : req.user._id,
      name : req.body.itemname,
      category : req.body.category,
      price : req.body.price,
      condition:req.body.condition,
      openTobargain : req.body.oktobargain?true:false,
      description : description,
      pic : image,
      range :range,
    })
    item.save()
       .then(() => res.redirect('/platform'))
       .catch((err)=>res.status(500).send(err));
  }); 

app.get('/postmyitem',checkAuthenticated ,async (req, res) => {
    res.render('postmyitem',{title:'Post My Item',user:req.user});
  });

app.get('/managemyitems',checkAuthenticated ,async (req, res) => {
    Item.find({seller : req.user._id})
      .then((found)=> res.render('managemyitems',{title:'Manage My Items',user:req.user,found:found}))
      .catch((err)=>res.status(500).send(err));
  });

app.get('/modify/:itemid',checkAuthenticated ,async (req, res) => {
   const id  = req.params.itemid;
   const item = await Item.findOne({_id: id});
   const renderobj = {};
   renderobj.title = 'Modify';
   renderobj.user = req.user;
   renderobj.id = id;
   renderobj.itemname = item.name;
   renderobj.category = item.category;
   renderobj.price = item.price;
   renderobj.condition = item.condition;
   renderobj.description = item.description;
   renderobj.checked = item.openTobargain?"checked":"";
   res.render('modify',renderobj);
});

app.post('/modify/:itemid',checkAuthenticated ,async (req, res) => {
  const openTobargain = req.body.newoktobargain?true:false;
  const update = removeProperties(req.body);
  update.openTobargain  = openTobargain;
  if (req.body.price){
    if (req.body.price < 10){
      update.range = 'Below 10';
    }
    else if (req.body.price <50 ){
      update.range = '10 - 49';
    }
    else if(req.body.price < 100){
      update.range = '50 - 99';
    }
    else if(req.body.price < 200){
      update.range = '100 - 199';
    }
    else{
      update.range = 'Above 200';
    }
  }
  await Item.findOneAndUpdate({_id : req.params.itemid},update);
  res.redirect("/managemyitems");
});

app.get('/delete/:itemid',checkAuthenticated ,async (req, res) => {
  const id  = req.params.itemid;
  await Item.deleteOne({_id:id});
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
