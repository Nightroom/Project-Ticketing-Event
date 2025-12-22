const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import Middleware Upload

// --- RUTE PUBLIK / USER ---

// Melihat daftar semua event (Support Filter & Search)
router.get('/', eventController.getAllEvents);

// Melihat detail satu event
router.get('/:id', eventController.getEventById);


// --- RUTE UNTUK CREATE/UPDATE (ADMIN CHECK DIHAPUS SESUAI REQUEST) ---

// Menambahkan event baru + Upload Gambar
// SEBELUM: router.post('/', verifyToken, isAdmin, upload.single('imageEvent'), ...);
// SESUDAH: Cukup verifyToken saja (Login required)
router.post('/', verifyToken, upload.single('imageEvent'), eventController.createEvent);

// Memperbarui data event + Ganti Gambar
// (Opsional: Kalau edit mau dilonggarkan juga, hapus isAdmin di sini. Kalau tidak, biarkan)
router.put('/:id', verifyToken, isAdmin, upload.single('imageEvent'), eventController.updateEvent);

// Menghapus event (Soft delete)
router.delete('/:id', verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;