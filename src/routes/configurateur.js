const router = require('express').Router();
const fs = require('fs');
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

router.post("/apercu", (req, res) => {
  const { image } = req.body;
  if (!image || !image.startsWith("data:image/png;base64,")) {
    return res.status(400).json({ error: "Image invalide" });
  }
  try {
    const base64 = image.replace(/^data:image\/png;base64,/, "");
    const buf = Buffer.from(base64, "base64");
    if (buf.length > 3 * 1024 * 1024) return res.status(400).json({ error: "Image trop lourde" });
    const path = require("path");
    const nom = "apercu-" + Date.now() + "-" + Math.round(Math.random() * 1e6) + ".png";
    const dossier = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(dossier)) fs.mkdirSync(dossier, { recursive: true });
    fs.writeFileSync(path.join(dossier, nom), buf);
    res.json({ success: true, path: "/uploads/" + nom });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
