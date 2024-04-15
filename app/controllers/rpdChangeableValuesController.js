const RpdChangeableValues = require('../models/rpd_changeable_values');

class RpdChangeableValuesController {
  constructor(pool) {
    this.model = new RpdChangeableValues(pool);
  }

  async getChangeableValues(req, res) {
    try {
      const value = await this.model.getChangeableValue(req.query.title);
      if (!value) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json(value);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateChangeableValue(req, res) {
    try {
      const updatedValue = await this.model.updateChangeableValue(req.params.id, req.body.value);
      if (!updatedValue) {
        return res.status(404).json({ message: 'Value not found' });
      }
      res.json(updatedValue);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = RpdChangeableValuesController;