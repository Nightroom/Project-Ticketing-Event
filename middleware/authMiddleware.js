const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk memverifikasi Token JWT (Umum)
exports.verifyToken = (req, res, next) => {
    // Ambil token dari header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ 
            status: "error", 
            message: "Akses ditolak! Anda harus login terlebih dahulu." // Sesuai aturan keamanan [cite: 48]
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Menyimpan data user (id & role) ke dalam request
        next(); // Lanjut ke controller berikutnya
    } catch (error) {
        res.status(403).json({ 
            status: "error", 
            message: "Token tidak valid atau sudah kedaluwarsa." 
        });
    }
};

// Middleware khusus untuk mengecek Role Admin
exports.isAdmin = (req, res, next) => {
    // Aturan Akses: Hanya admin yang boleh mengelola event [cite: 27, 39, 46]
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            status: "error", 
            message: "Akses terlarang! Hanya staff resmi/admin yang diizinkan."
        });
    }
};