class RpdProfileTemplates {
    constructor(pool) {
        this.pool = pool;
    }

    async getJsonProfile(id) {
        try {
            const queryResult = await this.pool.query('SELECT * FROM rpd_profile_templates WHERE id = $1', [id]);
            return queryResult.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async updateById(id, fieldToUpdate, value) {
        try {
            const queryResult = await this.pool.query(`UPDATE rpd_profile_templates SET ${fieldToUpdate} = $1 WHERE id = $2 RETURNING *`, [value, id]);
            return queryResult.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async findByCriteria(faculty, levelEducation, directionOfStudy, profile, formEducation, year) {
        try {
            const queryResult = await this.pool.query(`
            SELECT id, disciplins_name, teacher FROM rpd_profile_templates
            WHERE faculty = $1 AND level_education = $2 AND direction_of_study = $3
            AND profile = $4 AND form_education = $5 AND year = $6`,
                [faculty, levelEducation, directionOfStudy, profile, formEducation, year]
            );
            return queryResult.rows;
        } catch (err) {
            throw err;
        }
    }

    async findOrCreateByDisciplineAndYear(disciplinsName, id, currentYear) {
        try {
          // Поиск существующей записи
          const searchResult = await this.pool.query(`
            SELECT * FROM rpd_profile_templates
            WHERE disciplins_name = $1 AND year = $2
          `, [disciplinsName, currentYear]);
          
          if (searchResult.rowCount > 0) {
            // Запись уже существует, возврат ID
            return {
                status: "record exists",
                data: searchResult.rows[0].id
            };
          } else {
            // Копирование данных и создание новой записи
            const existingRecordResult = await this.pool.query(`
              SELECT * FROM rpd_profile_templates WHERE id = $1
            `, [id]);
            const existingRecord = existingRecordResult.rows[0];
            if (!existingRecord) {
              throw new Error('Existing record not found');
            }
    
            const { rows } = await this.pool.query(`
              INSERT INTO rpd_profile_templates (
                disciplins_name, year, 
                faculty, department, direction_of_study, profile,
                level_education, form_education, teacher, protocol, goals, place,
                semester, certification, place_more_text, competencies, zet, content,
                content_more_text, content_template_more_text, methodological_support_template,
                assessment_tools_template, textbook, additional_textbook, professional_information_resources,
                software, logistics_template
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8,
                $9, $10, $11, $12, $13, $14,
                $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27
              ) RETURNING *
            `, [
              disciplinsName, currentYear,
              existingRecord.faculty, existingRecord.department, existingRecord.direction_of_study, existingRecord.profile,
              existingRecord.level_education, existingRecord.form_education, existingRecord.teacher, existingRecord.protocol, existingRecord.goals, existingRecord.place,
              existingRecord.semester, existingRecord.certification, existingRecord.place_more_text, existingRecord.competencies, existingRecord.zet, existingRecord.content,
              existingRecord.content_more_text, existingRecord.content_template_more_text, existingRecord.methodological_support_template,
              existingRecord.assessment_tools_template, existingRecord.textbook, existingRecord.additional_textbook, existingRecord.professional_information_resources,
              existingRecord.software, existingRecord.logistics_template,
            ]);
    
            // Возврат данных новой записи
            return {
                status: "created",
                data: rows[0]
            };
          }
        } catch (err) {
          throw err;
        }
      }
}

module.exports = RpdProfileTemplates;