const mongoose = require('mongoose');
console.log(process.env.MONGODB_URI,"process.env.MONGODB_URI");
const mongourl = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/consultax';
mongoose.connect(mongourl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
