const RpdProfileTemplates = require('../models/rpd_profile_templates');

class RpdProfileTemplatesController {

  constructor(pool) {
    this.model = new RpdProfileTemplates(pool);
  }

  async getJsonProfile(req, res) {
    try {
      const value = await this.model.getJsonProfile(req.query.profile_server_key);
      if (!value) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json(value);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateById(req, res) {
    try {
      const updatedItem = await this.model.updateById(req.params.profile_server_key, req.body.fieldToUpdate, req.body.value);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = RpdProfileTemplatesController;