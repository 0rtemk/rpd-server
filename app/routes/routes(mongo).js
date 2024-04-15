const express = require('express');
const router = express.Router();

const generatePDF = require('../modules/pdfGenerator');
const RpdChangeableValues = require('../modules/rpdChangeableValues');
const RpdProfileTemplates = require('../modules/rpdProfileTemplates');

const Rpd1cExchange = require('../models(mongo)/rpd-1c-exchange-model');

// #region RpdChangeableValues

// Маршрут для получения всех записей
router.get('/rpd-changeable-values', async (req, res) => {
  const { title } = req.query;
  try {
    const value = await RpdChangeableValues.getChangeableValue(title);
    if (!value) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Маршрут для изменения данных по _id
router.put('/rpd-changeable-values/:_id', async (req, res) => {
  const { _id } = req.params;
  const { value } = req.body;
  try {
    const updatedValue = await RpdChangeableValues.updateChangeableValue(_id, value);
    if (!updatedValue) {
      return res.status(404).json({ message: 'Value not found' });
    }
    res.json(updatedValue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// #endregion

// #region RpdProfileTemplates
router.get('/rpd-profile-templates', async (req, res) => {
  const { profile_server_key } = req.query;
  try {
    const value = await RpdProfileTemplates.getJsonProfile(profile_server_key);
    if (!value) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update-json-value/:profile_server_key', async (req, res) => {
  const { profile_server_key } = req.params;
  const { fieldToUpdate, value } = req.body;

  try {
      const updatedItem = await RpdProfileTemplates.updateById(profile_server_key, fieldToUpdate, value);

      if (!updatedItem) {
          return res.status(404).json({ message: 'Элемент с данным ключом не найден' });
      }

      return res.json(updatedItem);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка при обновлении элемента' });
  }
});
// #endregion

// #region getPDFfile
router.post('/upload-pdf', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = req.files.file;

  uploadedFile.mv(`uploads/${uploadedFile.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded!');
  });
});

router.get('/generate-pdf', async (req, res) => {
  try {
    const pdfPath = await generatePDF();
    res.download(pdfPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});
// #endregion


// GET роут для получения данных по параметрам
router.get('/find-rpd', async (req, res) => {
  // Получаем параметры из строки запроса
  const {
    institute,
    level,
    direction,
    educationForm,
    enrollmentYear,
    educationYear
  } = req.query;

  // Проверяем наличие всех параметров
  if (!institute || !level || !direction || !educationForm || !enrollmentYear || !educationYear) {
    return res.status(400).send('Все параметры должны быть указаны.');
  }

  try {
    // Поиск записи в базе данных
    const record = await Rpd1cExchange.findOne({
      faculty: institute,
      education_level: level,
      direction: direction,
      profile: educationForm,
      education_form: enrollmentYear,
      year: parseInt(educationYear) // Предполагается, что year - это числовое поле
    }).select('discipline teachers -_id'); // Возврат только полей discipline и teachers

    // Проверка наличия найденной записи
    if (!record) {
      return res.status(404).send('Запись не найдена.');
    }

    // Отправка найденной записи
    res.status(200).json(record);
  } catch (error) {
    console.error('Ошибка при поиске в базе данных:', error);
    res.status(500).send('Внутренняя ошибка сервера.');
  }
});

module.exports = router;
