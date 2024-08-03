import mongoose from 'mongoose';
import config from '../utils/config.js';
mongoose.connect(config.DB.URI);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Mongodb connection stablished');
});
connection.on('error', err => {
    console.log(err);
    process.exit(0);
});
