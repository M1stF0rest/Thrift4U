import mongoose from 'mongoose';

// OPTIONAL: modify the connection code below if
// using mongodb authentication
const mongooseOpts = {
  useNewUrlParser: true,  
  useUnifiedTopology: true
};

mongoose.connect('mongodb://localhost/hw05',mongooseOpts)
    .then(console.log('connected to database'))
    .catch(error => console.log(error));

// TODO: create schema and register models
const userSchema = new mongoose.Schema({
    username: String,
    password: Number, // a password 
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
});


mongoose.model('User', userSchema);
mongoose.model('Item', itemSchema);