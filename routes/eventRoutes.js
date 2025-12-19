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


// --- RUTE KHUSUS ADMIN ---
// Memerlukan login (verifyToken) DAN hak akses (isAdmin)

// Menambahkan event baru + Upload Gambar
// 'imageEvent' adalah nama key form-data yang harus dipakai di Frontend/Postman
router.post('/', verifyToken, isAdmin, upload.single('imageEvent'), eventController.createEvent);

// Memperbarui data event + Ganti Gambar
router.put('/:id', verifyToken, isAdmin, upload.single('imageEvent'), eventController.updateEvent);

// Menghapus event (Soft delete)
router.delete('/:id', verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;