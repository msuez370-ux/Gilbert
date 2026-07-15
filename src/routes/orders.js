const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/auth');

router.post('/', ctrl.create);
router.get('/', requireAdmin, ctrl.getAll);
router.get('/:id', requireAdmin, ctrl.getOne);
router.patch('/:id/statut', requireAdmin, ctrl.updateStatus);

module.exports = router;
