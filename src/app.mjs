import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import './db.mjs';
const User = mongoose.model('User');
const Item = mongoose.model('Item');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(process.env.PORT || 3000);