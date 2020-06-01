import mongoose, { mongo, ConnectionOptions } from 'mongoose'
import config from './config/config'

const dbOptions: ConnectionOptions ={
    useNewUrlParser: true,
    useUnifiedTopology: true

}
mongoose.connect(config.DB.URI,dbOptions);

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log(' - mongodb connection stablished');
});

connection.on('error',err =>{
    console.log(err);
    process.exit(0);
})