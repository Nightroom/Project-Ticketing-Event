const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk Registrasi User Baru (Use Case: Register)
// Menangani pendaftaran akun agar user dapat menggunakan sistem [cite: 58, 59]
router.post('/register', authController.register);

// Route untuk Login (Use Case: Login)
// Memverifikasi kredensial untuk mengarahkan ke dashboard sesuai hak akses [cite: 51, 52]
router.post('/login', authController.login);

module.exports = router;