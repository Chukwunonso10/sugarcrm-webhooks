const mongoose = require('mongoose')

const connectDB = async ()=> {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>console.log('Database Connection was successsful'))
    .catch((error)=> console.error('connection failed', error.message))
}

module.exports = connectDB