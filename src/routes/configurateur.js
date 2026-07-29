const router = require('express').Router();
const db = require('../config/db');
const ctrl = require('../controllers/configurateurController');
const { requireAdmin } = require('../middleware/auth');
const { uploadLogo } = require('../middleware/upload');

// Enregistre un fichier en base (persiste aux redeploiements)
async function enregistrer(nom, mime, buffer) {
  await db.query(
    'INSERT INTO fichiers (nom, type_mime, taille, contenu) VALUES (?,?,?,?)',
    [nom, mime, buffer.length, buffer]
  );
  return '/uploads/' + nom;
}

// Upload du logo client
router.post('/upload-logo', uploadLogo, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier recu' });
  try {
    const fs = require('fs');
    const buffer = req.file.buffer || fs.readFileSync(req.file.path);
    const chemin = await enregistrer(req.file.filename, req.file.mimetype, buffer);
    // Nettoie le fichier temporaire du disque
    if (req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.json({ success: true, path: chemin });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Apercu du cachet genere par le configurateur
router.post('/apercu', async (req, res) => {
  const { image } = req.body;
  if (!image || !image.startsWith('data:image/png;base64,')) {
    return res.status(400).json({ error: 'Image invalide' });
  }
  try {
    const buf = Buffer.from(image.replace(/^data:image\/png;base64,/, ''), 'base64');
    if (buf.length > 3 * 1024 * 1024) return res.status(400).json({ error: 'Image trop lourde' });
    const nom = 'apercu-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + '.png';
    const chemin = await enregistrer(nom, 'image/png', buf);
    res.json({ success: true, path: chemin });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/order', uploadLogo, ctrl.submitOrder);
router.get('/orders', requireAdmin, ctrl.getAll);
router.patch('/orders/:id/bat', requireAdmin, ctrl.updateBat);

module.exports = router;
