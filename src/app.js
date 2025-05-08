require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
    requestValidator,
    errorHandler,

} = require('./middlewares');
const http = require('http');


const { connectMongoDB } = require('./libs/connections/mongoDB');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const router = require('./routes');
const { randomConstant } = require('./constants/random.contants');
const { PORT } = randomConstant;
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('hello world');
});
app.use(requestValidator);
app.use('/api', router);
app.use(errorHandler);
server.listen(PORT, async () => {
    await connectMongoDB();
    console.log('server started @', new Date(), '\nOn Port ::: ', PORT);
});