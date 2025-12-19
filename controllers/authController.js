const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Use Case: Register [cite: 58]
exports.register = async (req, res) => {
    try {
        const { nama, email, password, nohp } = req.body;

        // 1. Validasi Input: Pastikan email belum terdaftar 
        const userExists = await User.findOne({ where: { Email: email } });
        if (userExists) {
            return res.status(400).json({ message: "Email sudah pernah terdaftar!" });
        }

        // 2. Simpan User (Hashing password dilakukan otomatis di Model User hooks jika sudah disetel) [cite: 37, 49, 64]
        const newUser = await User.create({
            Nama: nama,
            Email: email,
            Password: password, // Akan di-hash otomatis oleh Sequelize Hooks di Model
            NoHP: nohp
        });

res.status(201).json({
            status: "success",
            message: "Akun user berhasil dibuat",
            data: { id: newUser.UserID, nama: newUser.Nama, email: newUser.Email }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Use Case: Login [cite: 51]
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user berdasarkan email [cite: 55, 56]
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        // 2. Verifikasi Password (Bandingkan input dengan hash di database) [cite: 56]
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah!" });
        }

        // 3. Buat JWT Token (Sebagai sesi login yang aman) [cite: 57]
        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token kedaluwarsa dalam 1 jam
        );

        res.status(200).json({
            status: "success",
            message: "Login berhasil",
            token,
            data: {
                id: user.UserID,
                nama: user.Nama,
                role: user.Role
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};