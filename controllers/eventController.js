const Event = require('../models/Event');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// --- UNTUK USER (Public Access) ---

// 1. Melihat semua event (Support Search, Filter Kategori, & Kalender)
exports.getAllEvents = async (req, res) => {
    try {
        // Ambil parameter dari URL (misal: ?search=fest&kategory=Music)
        const { search, kategory, startDate, endDate } = req.query;
        
        let whereCondition = { StatusEvent: 'Aktif' };

        // Fitur Search (Nama Event)
        if (search) {
            whereCondition.NamaEvent = { [Op.like]: `%${search}%` };
        }

        // Fitur Filter Kategori
        if (kategory) {
            whereCondition.Kategori = kategory;
        }

        // Fitur Kalender (Rentang Tanggal)
        if (startDate && endDate) {
            whereCondition.TanggalEvent = {
                [Op.between]: [startDate, endDate]
            };
        }

        const events = await Event.findAll({ 
            where: whereCondition,
            order: [['TanggalEvent', 'ASC']] // Urutkan dari yang terdekat
        });
        
        res.status(200).json({ status: "success", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 2. Melihat detail satu event
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan!" });
        }
        res.status(200).json({ status: "success", data: event });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// --- UNTUK ADMIN (CRUD & Upload) ---

// 3. Create Event (Dengan Upload Gambar)
exports.createEvent = async (req, res) => {
    try {
        // req.body berisi text, req.file berisi info file gambar
        const { namaEvent, deskripsi, tanggalEvent, lokasi, kuota, harga, kategori } = req.body;
        
        // Ambil nama file jika ada upload
        const imageFilename = req.file ? req.file.filename : null;

        // Validasi Sederhana
        if (!namaEvent) return res.status(400).json({ message: "Nama event wajib diisi!" });

        const newEvent = await Event.create({
            NamaEvent: namaEvent,
            Deskripsi: deskripsi,
            TanggalEvent: tanggalEvent,
            Lokasi: lokasi,
            Kuota: kuota,
            Harga: harga || 0,        // Default 0 jika kosong
            Kategori: kategori,
            Image: imageFilename,     // Simpan nama file ke database
            StatusEvent: 'Aktif'
        });

        res.status(201).json({ message: "Event berhasil dibuat!", data: newEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Event (Support Ganti Gambar)
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

        const { namaEvent, deskripsi, tanggalEvent, lokasi, kuota, harga, kategori } = req.body;

        let updateData = {
            NamaEvent: namaEvent,
            Deskripsi: deskripsi,
            TanggalEvent: tanggalEvent,
            Lokasi: lokasi,
            Kuota: kuota,
            Harga: harga,
            Kategori: kategori
        };

        // Logika Ganti Gambar
        if (req.file) {
            // 1. Hapus gambar lama dari folder uploads (jika ada) agar tidak nyampah
            if (event.Image) {
                const oldPath = path.join(__dirname, '../uploads/events/', event.Image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            // 2. Set gambar baru
            updateData.Image = req.file.filename;
        }

        await event.update(updateData);
        res.status(200).json({ message: "Event berhasil diperbarui!", data: updateData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Delete Event (Soft Delete)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

        await event.update({ StatusEvent: 'Tidak Aktif' });
        res.status(200).json({ message: "Event berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};