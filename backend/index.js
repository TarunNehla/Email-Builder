const express = require('express')
const bodyParser = require('body-parser');
const app = express()
require('dotenv').config();
require('./models/dbConnection');
const cors = require('cors');
const router = require('./routes/router');

app.use(express.static('dist'))

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/uploads', express.static('uploads'));

app.use('/api', router);


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})