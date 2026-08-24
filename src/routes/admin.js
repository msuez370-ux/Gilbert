const router = require('express').Router();
const { login, logout } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);

const db = require("../config/db");
const { requireAdmin } = require("../middleware/auth");

router.get("/journal", requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT type, message, email, ip, reference, created_at FROM journal ORDER BY id DESC LIMIT 200"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Journal indisponible" });
  }
});

const { genererFacture, genererBonLivraison } = require("../services/documentService");

router.get("/commandes/:id/facture", requireAdmin, async (req, res) => {
  try {
    const { buffer, numero } = await genererFacture(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=\"" + numero + ".pdf\"");
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: "Document indisponible" });
  }
});

router.get("/commandes/:id/bon-livraison", requireAdmin, async (req, res) => {
  try {
    const { buffer, numero } = await genererBonLivraison(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=\"" + numero + ".pdf\"");
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: "Document indisponible" });
  }
});

module.exports = router;
