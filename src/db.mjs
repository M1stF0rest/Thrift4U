import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
// is the environment variable, NODE_ENV, set to PRODUCTION? 
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finalproject';
}
// OPTIONAL: modify the connection code below if
// using mongodb authentication
const mongooseOpts = {
  useNewUrlParser: true,  
  useUnifiedTopology: true
};

mongoose.connect(dbconf,mongooseOpts)
    .then(console.log('connected to database'))
    .catch(error => console.log(error));

// TODO: create schema and register models
const userSchema = new mongoose.Schema({
    username: String,
    contact: String,
});

const itemSchema = new mongoose.Schema({
  seller:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },// a reference to a User object
  name: String,
  category: String,
  price: Number,
  openTobargain: Boolean,
  description: String,
  condition:String,
  pic:Buffer,
  range: String,
});

userSchema.plugin(passportLocalMongoose); 

mongoose.model('User', userSchema);
mongoose.model('Item', itemSchema);