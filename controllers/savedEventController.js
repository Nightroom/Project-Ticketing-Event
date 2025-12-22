const SavedEvent = require('../models/savedEvent'); // Pastikan nama file model benar
const Event = require('../models/event');           // Pastikan nama file model benar

// --- 1. TOGGLE SAVE (Simpan / Hapus) ---
exports.toggleSavedEvent = async (req, res) => {
    try {
        // Ambil UserID dari Token (Pastikan user sudah login)
        const userID = req.user.id; 
        // Ambil EventID dari Body yang dikirim Frontend
        const { eventID } = req.body; 

        // Validasi: EventID tidak boleh kosong
        if (!eventID) {
            return res.status(400).json({ 
                status: "error",
                message: "EventID wajib dikirim!" 
            });
        }

        // Cek di database: Apakah user ini sudah simpan event ini?
        const existingSave = await SavedEvent.findOne({
            where: {
                UserID: userID,
                EventID: eventID
            }
        });

        if (existingSave) {
            // JIKA SUDAH ADA -> HAPUS (UNSAVE)
            await existingSave.destroy();
            return res.status(200).json({ 
                status: "success", 
                message: "Event berhasil dihapus dari daftar simpan.", 
                isSaved: false 
            });
        } else {
            // JIKA BELUM ADA -> BUAT BARU (SAVE)
            await SavedEvent.create({
                UserID: userID,
                EventID: eventID
            });
            return res.status(201).json({ 
                status: "success", 
                message: "Event berhasil disimpan ke wishlist!", 
                isSaved: true 
            });
        }

    } catch (error) {
        console.error("Error toggleSavedEvent:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Terjadi kesalahan server.",
            error: error.message 
        });
    }
};

// --- 2. GET USER SAVED EVENTS (Lihat Daftar) ---
exports.getUserSavedEvents = async (req, res) => {
    try {
        const userID = req.user.id;

        // Cari semua data di tabel SavedEvent milik user ini
        const savedEvents = await SavedEvent.findAll({
            where: { UserID: userID },
            include: [
                {
                    model: Event, // Sertakan data Event lengkap
                    attributes: ['EventID', 'NamaEvent', 'TanggalEvent', 'Lokasi', 'Image', 'Harga'] // Ambil kolom penting saja biar ringan
                }
            ],
            order: [['SavedEventID', 'DESC']] // Urutkan dari yang terakhir disimpan
        });

        res.status(200).json({
            status: "success",
            data: savedEvents
        });

    } catch (error) {
        console.error("Error getUserSavedEvents:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Gagal mengambil data saved event.",
            error: error.message 
        });
    }
};