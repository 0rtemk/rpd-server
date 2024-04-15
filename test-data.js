const { pool } = require('./config/db');

const insertQuery = `INSERT INTO rpd_changeable_values(title, value) VALUES($1, $2)`;

const values = [
    "ApprovalField",
    "Утверждаю и.о. проректора по учебно-методической работе __________/ Анисимова О.В. __________________202_ год"
];

// Выполнение запроса с помощью предполагаемого pool объекта
pool.query(insertQuery, values, (err, result) => {
  if (err) {
    // Обработка ошибки
    console.error('Error executing query', err.stack);
  } else {
    console.log('Insertion success', result);
  }
});