const { pool } = require('../../config/db');

(async () => {
  try {
    // Миграция для таблицы `rpd_profile_templates`
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rpd_profile_templates (
        id SERIAL PRIMARY KEY,
        profile_server_key VARCHAR(255),
        disciplins_name TEXT,
        year INTEGER,
        uni_name TEXT,
        faculty TEXT,
        department TEXT,
        direction_of_study TEXT,
        profile TEXT,
        level_education TEXT,
        form_education TEXT,
        teacher TEXT,
        protocol TEXT,
        goals TEXT,
        place TEXT,
        semester INTEGER,
        certification TEXT,
        place_more_text TEXT,
        competencies JSONB,
        zet INTEGER,
        content JSONB,
        content_more_text TEXT,
        content_template_more_text TEXT,
        methodological_support_template TEXT,
        assessment_tools_template TEXT,
        textbook TEXT,
        additional_textbook TEXT,
        professional_information_resources TEXT,
        software TEXT,
        logistics_template TEXT
      );
    `);

    // Миграция для таблицы `rpd_1c_exchange`
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rpd_1c_exchange (
        id SERIAL PRIMARY KEY,
        year INTEGER,
        education_form VARCHAR(255),
        education_level VARCHAR(255),
        faculty TEXT,
        department TEXT,
        profile TEXT,
        direction TEXT,
        discipline TEXT,
        teachers TEXT[], -- Предполагаем массив текстовых значений
        results TEXT[], -- Предполагаем массив текстовых значений
        zet INTEGER,
        place TEXT,
        study_load TEXT[], -- Предполагаем массив текстовых значений
        semester INTEGER
      );
    `);

    // Миграция для таблицы `rpd_changeable_values`
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rpd_changeable_values (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        value TEXT
      );
    `);

    console.log('Все миграции згружены успешно');
  } catch (error) {
    console.error('Ошибка загрузки миграций', error.stack);
  } finally {
    await pool.end();
  }
})();