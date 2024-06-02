const { exchange1C } = require("../modules/1cExchange");

class RpdComplects {
    constructor(pool) {
        this.pool = pool;
    }

    async findRpdComplect(data) {
        try {
            const result = await this.pool.query(`
                SELECT id from rpd_complects
                WHERE faculty = $1
                AND year = $2
                AND education_form = $3
                AND education_level = $4
                AND profile = $5
                AND direction = $6
            `, [
                data.faculty,
                data.year,
                data.formEducation,
                data.levelEducation,
                data.profile,
                data.directionOfStudy
            ]);
            const resultId = result.rows[0];
            if(!resultId) return "NotFound";
            return resultId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async findRpdComplectData(template_id) {
        try {
            const result = await this.pool.query(`
                SELECT * FROM rpd_complects
                WHERE ID = (
                    SELECT id_rpd_complect FROM rpd_profile_templates
                    WHERE id = $1
                )`, [template_id]);
            return result.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async createRpdComplect(data) {
        try {
            const apiData = {
                faculty: data.faculty,
                year: data.year,
                educationLevel: data.levelEducation,
                educationForm: data.formEducation,
                profile: data.profile,
                direction: data.directionOfStudy
            }
            const RpdComplectId = await exchange1C(apiData);
            return RpdComplectId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

module.exports = RpdComplects;