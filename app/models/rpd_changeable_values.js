class RpdChangeableValues {
    constructor(pool) {
        this.pool = pool;
    }

    async getChangeableValue(title) {
        try {
            const queryResult = await this.pool.query('SELECT * FROM rpd_changeable_values WHERE title = $1', [title]);
            return queryResult.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async updateChangeableValue(id, value) {
        try {
            const queryResult = await this.pool.query('UPDATE rpd_changeable_values SET value = $1 WHERE id = $2 RETURNING *', [value, id]);
            return queryResult.rows[0];
        } catch (err) {
            throw err;
        }
    }
}

module.exports = RpdChangeableValues;