const express = require('express');
const router = express.Router();
const generatePDF = require('../modules/pdfGenerator');
const { pool } = require('../../config/db');

const RpdChangeableValuesController = require('../controllers/rpdChangeableValuesController');
const rpdChangeableValuesController = new RpdChangeableValuesController(pool);

router.get('/rpd-changeable-values', rpdChangeableValuesController.getChangeableValues.bind(rpdChangeableValuesController));
router.put('/rpd-changeable-values/:id', rpdChangeableValuesController.updateChangeableValue.bind(rpdChangeableValuesController));

const RpdProfileTemplatesController = require('../controllers/rpdProfileTemplatesController');
const rpdProfileTemplatesController = new RpdProfileTemplatesController(pool);

router.get('/rpd-profile-templates', rpdProfileTemplatesController.getJsonProfile.bind(rpdProfileTemplatesController));
router.put('/update-json-value/:profile_server_key', rpdProfileTemplatesController.updateById.bind(rpdProfileTemplatesController));

const Rpd1cExchangeController = require('../controllers/rpd1cExchangeController');
const rpd1cExchangeController = new Rpd1cExchangeController(pool);

router.get('/find-rpd', rpd1cExchangeController.findRpd.bind(rpd1cExchangeController));

router.get('/generate-pdf', async (req, res) => {
    try {
      const pdfPath = await generatePDF();
      res.download(pdfPath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  });

module.exports = router;