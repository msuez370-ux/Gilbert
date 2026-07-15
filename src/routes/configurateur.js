const router = require('express').Router();
const ctrl = require('../controllers/configurateurController');
const { requireAdmin } = require('../middleware/auth');
const { uploadLogo } = require('../middleware/upload');

router.post('/upload-logo', uploadLogo, (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier recu' });
  res.json({ success: true, path: '/uploads/' + req.file.filename });
});

router.post('/order', uploadLogo, ctrl.submitOrder);
router.get('/orders', requireAdmin, ctrl.getAll);
router.patch('/orders/:id/bat', requireAdmin, ctrl.updateBat);

module.exports = router;
