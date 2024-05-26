const { pool } = require('../../config/db');
const axios = require('axios');
const moment = require('moment');

async function addElementsToDB() {
  const apiData = {
    year: 2023,
    educationLevel: "бакалавриат",
    educationForm: "очная",
    profile: "Технологии разработки программного обеспечения",
    direction: "09.03.01 Информатика и вычислительная техника"
  }

  try {
    const apiUrl = `https://1c-api.uni-dubna.ru/v1/api/persons/reports/GetWorkProgramOfDiscipline?Year=${apiData.year}&Education_Level=${apiData.educationLevel}&Education_Form=${apiData.educationForm}&Profile=${apiData.profile}&Direction=${apiData.direction}`;
    const responseUrl = await axios.get(apiUrl);
    if (responseUrl.status !== 200) {
      throw new Error('Ошибка при запросе данных с API GetWorkProgramOfDiscipline');
    }
    const records = await responseUrl.data;
    const recordsLength = records.length;
    console.log(`Всего дисциплин из запроса - ${recordsLength}`);

    let currentIndex = 0;
    for (const record of records) {
      console.log(`Дисциплина ${++currentIndex} из ${recordsLength}`);
      const apiUpLink = `https://1c-api.uni-dubna.ru/v1/api/persons/reports/GetEducationResults?UPLink=${record.upLink}`;
      const responseUpLink = await axios.get(apiUpLink);
      if (responseUpLink.status !== 200) {
        throw new Error('Ошибка при запросе данных с API GetEducationResults');
      }
      const educationResults = await responseUpLink.data;

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
        zet,
        place,
        study_load,
        semester
      } = record;

      const insertQuery = `
      INSERT INTO rpd_1c_exchange (
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
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) 
      ON CONFLICT DO NOTHING
      RETURNING id`;

      const result = await pool.query(insertQuery, [
        year,
        education_form,
        education_level,
        faculty,
        department,
        profile,
        direction,
        discipline,
        teachers,
        educationResults,
        zet,
        place,
        study_load,
        semester,
      ]);

      const insertedId = result.rows[0].id;
      const history = [{
          date: moment().format(),
          status: "Выгружен из 1С",
          user: "Система"
      }]

      await pool.query(`
        INSERT INTO template_status (id_1c_template, history) 
        VALUES (${JSON.stringify(insertedId)}, '${JSON.stringify(history)}')
      `);
    }

    console.log('Данные успешно добавлены в базу данных.');
  } catch (error) {
    console.error(error);
  }
}

addElementsToDB();