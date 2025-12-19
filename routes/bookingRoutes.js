const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import Middleware Upload

// 1. Route Pesan Tiket (Checkout)
// Tambahkan 'upload.single' agar user bisa langsung upload bukti bayar saat checkout (opsional)
// Key file di Postman/Frontend: 'paymentProof'
router.post('/book', verifyToken, upload.single('paymentProof'), bookingController.pesanTiket);

// 2. Route Upload Bukti Bayar Susulan (Payment)
// Digunakan jika user checkout dulu, baru bayar nanti lewat halaman History
// Endpoint: POST /api/bookings/pay/1 (dimana 1 adalah PendaftaranID)
router.post('/pay/:id', verifyToken, upload.single('paymentProof'), bookingController.uploadPayment);

// 3. Route Riwayat Pendaftaran
router.get('/my-history', verifyToken, bookingController.getUserHistory);

module.exports = router;