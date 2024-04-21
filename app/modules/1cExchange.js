const express = require('express');
const pool = require('../../config/db'); // Предположим, что у вас уже есть настроенный пул подключения к БД
const fetch = require('node-fetch'); // Не забудьте установить пакет node-fetch, если он еще не установлен

// Обращение к API и добавление элементов в БД
async function addElementsToDB() {
    try {
        // Обращаемся к API для получения данных
        const apiUrl = 'ВАША_ССЫЛКА_НА_API'; // Заменить на реальный URL API
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Ошибка при запросе данных с API');
        }
        const records = await response.json();
    
        // Перебираем массив записей и вставляем каждую запись в таблицу
        for (const record of records) {
          const {
            year,
            education_form,
            education_level,
            faculty,
            department,
            profile,
            direction,
            discipline,
            teachers,
            results,
            zet,
            place,
            study_load,
            semester
          } = record;
    
          // Обратите внимание, что здесь используется плейсхолдеры для предотвращения SQL инъекций
          const insertQuery = `INSERT INTO rpd_1c_exchange (year, education_form, education_level, faculty, department, profile, direction, discipline, teachers, results, zet, place, study_load, semester)
                               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
    
          await pool.query(insertQuery, [
            year,
            education_form,
            education_level,
            faculty,
            department,
            profile,
            direction,
            discipline,
            teachers,
            results,
            zet,
            place,
            study_load,
            semester
          ]);
        }
    
        res.send('Данные успешно добавлены в базу данных.');
      } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при обработке данных');
      }
}

addElementsToDB();