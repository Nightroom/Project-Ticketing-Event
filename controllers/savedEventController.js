const SavedEvent = require('../models/savedEvent');
const Event = require('../models/event');

// 1. Simpan Event ke Wishlist (Add to Saved)
exports.saveEvent = async (req, res) => {
    try {
        const { eventID } = req.body;
        const userID = req.user.id; // Diambil dari Token JWT

        // Cek apakah event valid
        const event = await Event.findByPk(eventID);
        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan!" });
        }

        // Cek apakah sudah pernah disimpan sebelumnya
        const existingSave = await SavedEvent.findOne({
            where: { UserID: userID, EventID: eventID }
        });

        if (existingSave) {
            return res.status(400).json({ message: "Event ini sudah ada di daftar simpanan Anda." });
        }

        // Simpan ke database
        await SavedEvent.create({
            UserID: userID,
            EventID: eventID
        });

        res.status(201).json({ status: "success", message: "Event berhasil disimpan!" });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 2. Lihat Semua Event yang Disimpan (Get User Wishlist)
exports.getSavedEvents = async (req, res) => {
    try {
        const userID = req.user.id;

        const savedEvents = await SavedEvent.findAll({
            where: { UserID: userID },
            include: [{
                model: Event, // Join ke tabel Event agar dapat detailnya (Nama, Gambar, dll)
                attributes: ['EventID', 'NamaEvent', 'TanggalEvent', 'Lokasi', 'Image', 'Kategori'] 
            }]
        });

        res.status(200).json({ status: "success", data: savedEvents });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 3. Hapus Event dari Simpanan (Remove from Wishlist)
exports.unsaveEvent = async (req, res) => {
    try {
        const { eventID } = req.params;
        const userID = req.user.id;

        const deleted = await SavedEvent.destroy({
            where: { UserID: userID, EventID: eventID }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Event tidak ditemukan di daftar simpanan." });
        }

        res.status(200).json({ status: "success", message: "Event dihapus dari daftar simpanan." });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};