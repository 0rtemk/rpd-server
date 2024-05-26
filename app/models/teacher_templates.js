const moment = require('moment');

class TeacherTemplates {
    constructor(pool) {
        this.pool = pool;
    }

    async bindTemplateWithTeacher(id, teacher, userName) {
        try {
            const fullname = teacher.split(' ');
            const nameParam = {
                name: fullname[1],
                surname: fullname[0],
                patronymic: fullname[2]
            }

            const userIdResult = await this.pool.query(`
             SELECT id FROM users WHERE fullname = $1
            `, [nameParam]);

            if (!userIdResult.rows[0]) return "UserNotFound";
            const userId = userIdResult.rows[0].id;

            const teacherTemplateRowResult = await this.pool.query(`
                SELECT id from teacher_templates 
                WHERE user_id = $1 and template_id = $2
            `, [userId, id]);

            if (teacherTemplateRowResult.rows[0]) return "TemplateAlreadyBinned";

            await this.pool.query(`
                INSERT INTO teacher_templates (
                    user_id, template_id
                ) VALUES (
                    $1, $2
                )
            `, [userId, id]);

            const status = {
                date: moment().format(),
                status: "Отправлен преподавателю",
                user: userName
            }

            await this.pool.query(`
                UPDATE template_status
                SET history = history || $1::jsonb
                WHERE id_profile_template = $2
            `, [status, id]);

            return "binnedSuccess";
        } catch (error) {
            throw error;
        }
    }

    async findTeacherTemplates(userName) {
        try {
            const fullname = userName.split(' ');
            const nameParam = {
                name: fullname[1],
                surname: fullname[0],
                patronymic: fullname[2]
            }

            const userIdResult = await this.pool.query(`
             SELECT id FROM users WHERE fullname = $1
            `, [nameParam]);

            if (!userIdResult.rows[0]) return "UserNotFound";
            const userId = userIdResult.rows[0].id;

            const result = await this.pool.query(`
                SELECT id, disciplins_name, faculty, direction_of_study, 
                profile, level_education, form_education, year, (
                    SELECT status FROM 
                    jsonb_array_elements((
                      SELECT history 
                      FROM template_status 
                      WHERE id_profile_template = rpd_profile_templates.id
                      LIMIT 1
                    )) AS elem(status)
                    ORDER BY elem DESC
                    LIMIT 1
                )
                FROM rpd_profile_templates
                WHERE id IN (
                    SELECT template_id from teacher_templates 
                    WHERE user_id = $1
                )
            `, [userId]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async employedTemplate(id, userName) {
        try {
            const status = {
                date: moment().format(),
                status: "Взят в работу",
                user: userName
            };

            await this.pool.query(`
                UPDATE template_status
                SET history = history || $1::jsonb
                WHERE id_profile_template = $2
            `, [status, id]);

            return "success";
        } catch (error) {
            throw error
        }
    }
}

module.exports = TeacherTemplates;