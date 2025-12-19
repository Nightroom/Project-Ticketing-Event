const express = require('express');
const router = express.Router();
const savedEventController = require('../controllers/savedEventController');
const { verifyToken } = require('../middleware/authMiddleware');

// Semua rute di sini butuh login (verifyToken)

// 1. Simpan Event (POST /api/saved)
router.post('/', verifyToken, savedEventController.saveEvent);

// 2. Lihat Daftar Simpanan (GET /api/saved)
router.get('/', verifyToken, savedEventController.getSavedEvents);

// 3. Hapus Simpanan (DELETE /api/saved/:eventID)
router.delete('/:eventID', verifyToken, savedEventController.unsaveEvent);

module.exports = router;