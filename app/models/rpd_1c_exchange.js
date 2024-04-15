class Rpd1cExchange {
    constructor(pool) {
      this.pool = pool;
    }
  
    async findRpd(params) {
      try {
        const { institute, level, direction, educationForm, enrollmentYear, educationYear } = params;
        const queryResult = await this.pool.query(`
          SELECT discipline, teachers FROM rpd_1c_exchange 
          WHERE faculty = $1 AND education_level = $2 AND direction = $3 AND profile = $4 AND education_form = $5 AND year = $6`,
          [institute, level, direction, educationForm, enrollmentYear, parseInt(educationYear)]
        );
        return queryResult.rows[0]; // Предполагается, что поиск вернёт одну запись
      } catch (err) {
        throw err;
      }
    }
  }
  
  module.exports = Rpd1cExchange;