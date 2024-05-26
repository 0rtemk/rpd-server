const moment = require('moment');

class Rpd1cExchange {
  constructor(pool) {
    this.pool = pool;
  }

  async findRpd(faculty, levelEducation, directionOfStudy, profile, formEducation, year) {
    try {
      const queryResult = await this.pool.query(`
          SELECT id, discipline, teachers, teacher, semester, (
            SELECT status FROM 
            jsonb_array_elements((
              SELECT history FROM template_status 
              WHERE id_1c_template = rpd_1c_exchange.id 
              LIMIT 1
            )) as elem(status)
            ORDER BY elem DESC
            LIMIT 1
          )
          FROM rpd_1c_exchange 
          WHERE faculty = $1 
          AND education_level = $2 
          AND direction = $3 
          AND profile = $4 
          AND education_form = $5 
          AND year = $6`,
        [faculty, levelEducation, directionOfStudy, profile, formEducation, Number(year)]
      );
      return queryResult.rows;
    } catch (err) {
      throw err;
    }
  }

  async createTemplate(id, teacher, year, discipline, userName) {
    try {
      const searchResult = await this.pool.query(`
      SELECT * FROM rpd_profile_templates
      WHERE disciplins_name = $1 AND year = $2
    `, [discipline, year]);

      if (searchResult.rowCount > 0) {
        return "record exists";
      } else {
        const templateData = await this.pool.query(`
        SELECT * FROM rpd_1c_exchange
        WHERE id = $1`, [Number(id)]
        );

        const resultData = templateData.rows[0];
        const competencies = resultData.results.reduce((acc, current, index) => {
          acc[index] = {
            results: "",
            indicator: "",
            competence: current
          };
          return acc;
        }, {});

        const queryResult = await this.pool.query(`
        INSERT INTO rpd_profile_templates (
          disciplins_name, 
          year, 
          faculty, 
          department, 
          direction_of_study, 
          profile,
          level_education, 
          form_education, 
          teacher,
          place,
          semester,
          competencies, 
          zet
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13
        ) RETURNING id`, 
        [
          discipline,
          year,
          resultData.faculty,
          resultData.department,
          resultData.direction,
          resultData.profile,
          resultData.education_level,
          resultData.education_form,
          teacher,
          resultData.place,
          resultData.semester,
          competencies,
          resultData.zet,
          // добавить resultData.study_load - общее количество часов
        ]);

        await this.pool.query(`
          UPDATE rpd_1c_exchange
          SET teacher = $1
          WHERE id = $2`, 
        [teacher, id]);

        const idProfileTemplate = queryResult.rows[0].id;
        const status = {
          date: moment().format(),
          status: "Создан",
          user: userName
        }

        await this.pool.query(`
          UPDATE template_status
          SET history = history || $1::jsonb,
          id_profile_template = $2
          WHERE id_1c_template = $3`, 
        [status, idProfileTemplate, id])

        return "template created";
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}

module.exports = Rpd1cExchange;