const Pendaftaran = require('../models/Pendaftaran');
const Event = require('../models/Event');

// 1. Pesan Tiket (Checkout & Payment)
exports.pesanTiket = async (req, res) => {
    try {
        // Ambil data dari Body (Form Data)
        const { eventID, jumlahTiket, metodePembayaran } = req.body;
        const userID = req.user.id; // Diambil dari Token JWT (middleware)
        
        // Ambil file bukti bayar (jika ada upload langsung)
        const buktiBayarFile = req.file ? req.file.filename : null;

        // Validasi Input Dasar
        if (!jumlahTiket || jumlahTiket < 1) {
            return res.status(400).json({ message: "Jumlah tiket minimal 1!" });
        }

        // --- STEP 1: Cek Event & Kuota ---
        const event = await Event.findByPk(eventID);
        
        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan!" });
        }

        // Cek apakah kuota cukup untuk jumlah yang diminta
        if (event.Kuota < jumlahTiket) {
            return res.status(400).json({ 
                message: `Kuota tidak cukup! Sisa hanya ${event.Kuota} tiket.` 
            });
        }

        // --- STEP 2: Hitung Total Harga ---
        // Jika harga gratis (0), total juga 0
        const totalHarga = event.Harga * jumlahTiket;

        // --- STEP 3: Simpan Transaksi ---
        const pendaftaran = await Pendaftaran.create({
            UserID: userID,
            EventID: eventID,
            JumlahTiket: jumlahTiket,
            TotalHarga: totalHarga,
            MetodePembayaran: metodePembayaran || 'Manual Transfer',
            BuktiBayar: buktiBayarFile, // Simpan nama file struk
            StatusPembayaran: buktiBayarFile ? 'Verifying' : 'Pending', // Jika ada bukti, status Verifying
            StatusDaftar: 'Berhasil'
        });

        // --- STEP 4: Kurangi Kuota Event ---
        // Kurangi sesuai jumlah tiket yang dibeli
        await event.decrement('Kuota', { by: jumlahTiket });

        res.status(201).json({
            status: "success",
            message: "Pendaftaran Berhasil!",
            data: {
                bookingID: pendaftaran.PendaftaranID,
                totalBayar: totalHarga,
                status: pendaftaran.StatusPembayaran
            }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 2. Upload Bukti Bayar Susulan (Opsional: Jika user bayar nanti)
// Endpoint: POST /api/bookings/pay/:id
exports.uploadPayment = async (req, res) => {
    try {
        const pendaftaranID = req.params.id;
        const buktiBayarFile = req.file ? req.file.filename : null;

        if (!buktiBayarFile) {
            return res.status(400).json({ message: "File bukti pembayaran wajib diupload!" });
        }

        const booking = await Pendaftaran.findByPk(pendaftaranID);
        if (!booking) {
            return res.status(404).json({ message: "Data pendaftaran tidak ditemukan!" });
        }

        // Update Data
        await booking.update({
            BuktiBayar: buktiBayarFile,
            StatusPembayaran: 'Verifying' // Ubah jadi Verifying agar admin ngecek
        });

        res.status(200).json({ message: "Bukti pembayaran berhasil diupload!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Lihat Riwayat Pendaftaran User
exports.getUserHistory = async (req, res) => {
    try {
        const userID = req.user.id; // Dari Token

        const history = await Pendaftaran.findAll({
            where: { UserID: userID },
            include: [{ 
                model: Event,
                attributes: ['NamaEvent', 'TanggalEvent', 'Lokasi', 'Image', 'Harga'] // Ambil info penting saja
            }],
            order: [['TanggalDaftar', 'DESC']] // Yang terbaru paling atas
        });

        res.status(200).json({ status: "success", data: history });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};