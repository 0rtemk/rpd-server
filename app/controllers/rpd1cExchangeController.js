const Rpd1cExchange = require('../models/rpd_1c_exchange');

class Rpd1cExchangeController {
    constructor(pool) {
        this.model = new Rpd1cExchange(pool);
    }

    async findRpd(req, res) {
        try {
            const record = await this.model.findRpd(req.query);
            if (!record) {
                return res.status(404).send('Запись не найдена.');
            }
            res.status(200).json(record);
        } catch (err) {
            console.error('Ошибка при поиске в базе данных:', err);
            res.status(500).send('Внутренняя ошибка сервера.');
        }
    }
}

module.exports = Rpd1cExchangeController;