const TemplateStatus = require('../models/template_status');

class TemplateStatusController {
    constructor(pool) {
        this.model = new TemplateStatus(pool);
    }

    async getTemplateHistory (req, res) {
        try {
            const { id } = req.body;
            const record = await this.model.getTemplateHistory(id);
            res.json(record);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TemplateStatusController;