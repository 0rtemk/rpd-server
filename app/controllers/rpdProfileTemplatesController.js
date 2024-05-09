const RpdProfileTemplates = require('../models/rpd_profile_templates');

class RpdProfileTemplatesController {

  constructor(pool) {
    this.model = new RpdProfileTemplates(pool);
  }

  async getJsonProfile(req, res) {
    try {
      const value = await this.model.getJsonProfile(req.query.id);
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
      const updatedItem = await this.model.updateById(req.params.id, req.body.fieldToUpdate, req.body.value);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findByCriteria(req, res) {
    try {
      const { faculty, levelEducation, directionOfStudy, profile, formEducation, year } = req.query;
      const records = await this.model.findByCriteria(faculty, levelEducation, directionOfStudy, profile, formEducation, year);
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findOrCreate(req, res) {
    try {
      const { disciplinsName, id, year } = req.body;
      // const currentYear = new Date().getFullYear();
      const record = await this.model.findOrCreateByDisciplineAndYear(disciplinsName, id, year);
      res.json(record);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = RpdProfileTemplatesController;