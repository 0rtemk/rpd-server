const Rpd1cExchange = require('../models/rpd_1c_exchange');

class Rpd1cExchangeController {
    constructor(pool) {
        this.model = new Rpd1cExchange(pool);
    }

    async findRpd(req, res) {
        try {
            const { complectId } = req.body;
            const records = await this.model.findRpd(complectId);
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createTemplate(req, res) {
        try {
            const { id_1c, complectId,  teacher, year, discipline, userName } = req.body;
            const record = await this.model.createTemplate(id_1c, complectId, teacher, year, discipline, userName);
            res.json(record);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = Rpd1cExchangeController;