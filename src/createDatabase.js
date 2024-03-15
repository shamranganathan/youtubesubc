require('dotenv').config()
const mongoose = require('mongoose')
const subscriberModel = require('./models/subscribers')
const data = require('./data')

// Connect to DATABASE
//  const DATABASE_URL = "mongodb://127.0.0.1:27017/subscribers";

//Connect to Cloud DATABASE (MongoDB Atlas Database) 
// const DATABASE_URL = process.env.MONGODB_URI;
const DATABASE_URL = "mongodb+srv://shambhavi:anushambhavi@cluster1.qps07ph.mongodb.net/subscribers";

mongoose.connect(DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Database created...'))

const refreshAll = async () => {
    await subscriberModel.deleteMany({})
    // console.log(connection)
    await subscriberModel.insertMany(data)
    await mongoose.disconnect();
}
refreshAll()