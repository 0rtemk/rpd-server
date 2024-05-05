const express = require('express');
const router = express.Router();
const generatePDF = require('../pdf-generator/document-generator');
const { pool } = require('../../config/db');

const RpdChangeableValuesController = require('../controllers/rpdChangeableValuesController');
const rpdChangeableValuesController = new RpdChangeableValuesController(pool);

router.get('/rpd-changeable-values', rpdChangeableValuesController.getChangeableValues.bind(rpdChangeableValuesController));
router.put('/rpd-changeable-values/:id', rpdChangeableValuesController.updateChangeableValue.bind(rpdChangeableValuesController));

const RpdProfileTemplatesController = require('../controllers/rpdProfileTemplatesController');
const rpdProfileTemplatesController = new RpdProfileTemplatesController(pool);

router.get('/rpd-profile-templates', rpdProfileTemplatesController.getJsonProfile.bind(rpdProfileTemplatesController));
router.put('/update-json-value/:id', rpdProfileTemplatesController.updateById.bind(rpdProfileTemplatesController));
router.get('/find-by-criteria', rpdProfileTemplatesController.findByCriteria.bind(rpdProfileTemplatesController));
router.post('/find-or-create-profile-template', rpdProfileTemplatesController.findOrCreate.bind(rpdProfileTemplatesController));

const Rpd1cExchangeController = require('../controllers/rpd1cExchangeController');
const rpd1cExchangeController = new Rpd1cExchangeController(pool);

router.get('/find-rpd', rpd1cExchangeController.findRpd.bind(rpd1cExchangeController));

router.get('/generate-pdf', async (req, res) => {
  try {
      const pdfBuffer = await generatePDF();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
      
      res.send(pdfBuffer);
  } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
  }
});

module.exports = router;