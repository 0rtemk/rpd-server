class RpdProfileTemplates {
    constructor(pool) {
        this.pool = pool;
    }

    async getJsonProfile(profile_server_key) {
        try {
            const queryResult = await this.pool.query('SELECT * FROM rpd_profile_templates WHERE profile_server_key = $1', [profile_server_key]);
            return queryResult.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async updateById(profile_server_key, fieldToUpdate, value) {
        try {
            const queryResult = await this.pool.query(`UPDATE rpd_profile_templates SET ${fieldToUpdate} = $1 WHERE profile_server_key = $2 RETURNING *`, [value, profile_server_key]);
            return queryResult.rows[0];
        } catch (err) {
            throw err;
        }
    }
}

module.exports = RpdProfileTemplates;