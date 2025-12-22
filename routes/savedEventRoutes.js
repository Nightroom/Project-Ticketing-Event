const express = require('express');
const router = express.Router();
const savedEventController = require('../controllers/savedEventController');
const { verifyToken } = require('../middleware/authMiddleware');

// --- RUTE WISHLIST / SAVED EVENT ---

// 1. Toggle Save (Simpan/Hapus Otomatis)
// Cukup satu endpoint POST. Kalau belum ada -> Save. Kalau udah ada -> Unsave.
// Nama fungsi harus 'toggleSavedEvent' (sesuai controller baru)
router.post('/', verifyToken, savedEventController.toggleSavedEvent);

// 2. Lihat Daftar Simpanan
// Nama fungsi harus 'getUserSavedEvents' (sesuai controller baru)
router.get('/', verifyToken, savedEventController.getUserSavedEvents);

// NOTE: Tidak perlu rute DELETE lagi, karena sudah dihandle oleh POST (Toggle)

module.exports = router;