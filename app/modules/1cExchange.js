const axios = require('axios');
const mongoose = require('mongoose');
const db = require('../../config/db');
const Rpd1cExchange = require('../models/rpd-1c-exchange-model');

const apiEndpoint = 'https://1c-api.uni-dubna.ru/v1/api/persons/reports/GetWorkProgramOfDiscipline?Year=2021&Education_Level=бакалавриат&Education_Form=очная&Profile=экономика';

// Обращение к API и добавление элементов в БД
async function addElementsToDB() {
    try {
        const response = await axios.get(apiEndpoint); // Посылаем GET-запрос к API
        const elements = response.data; // Предполагаем, что API возвращает массив элементов

        console.log(response);

        if (elements) {
            // Добавляем каждый элемент в базу данных
            elements.forEach(async (element) => {
                console.log(element);
                const newElement = new Rpd1cExchange(element);
                await newElement.save(); // Сохраняем новый элемент в базу данных
            });
            console.log('Все элементы были успешно добавлены.');
        } else {
            console.error('Ошибка: API не вернул массив элементов.');
        }
    } catch (error) {
        console.error('Ошибка при доступе к API или добавлении элементов в БД:', error);
    }
}

// Вызов функции добавления элементов при запуске модуля
mongoose.connect(db.url)
    .then(() => {
        console.log('Connected to MongoDB');
        addElementsToDB();
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });