class TemplateStatus {
    constructor(pool) {
        this.pool = pool;
    }

    async getTemplateHistory (id) {
        try {
            const result = await this.pool.query(`
                SELECT history FROM template_status
                WHERE id_profile_template = $1
            `, [id]);

            return result.rows[0].history;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

module.exports = TemplateStatus;