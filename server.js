const express = require('express');
const bodyParser = require('body-parser');
const { pool } = require('./config/db');
const routes = require('./app/routes/routes');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');

    app.use(express.json());
    // Передаем pool в роуты, чтобы их можно было использовать для запросов к базе данных.
    app.use('/api', routes);
    
    app.listen(port, () => {
      console.log('We are live on ' + port);
    });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL', err);
  });