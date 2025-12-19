const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Fungsi Bantuan: Pastikan folder tujuan ada
// Jika folder belum ada (misal di server baru), fungsi ini akan membuatnya otomatis
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
};

// 2. Konfigurasi Penyimpanan (Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/'; // Default folder (jaga-jaga)

        // Logika memisahkan folder berdasarkan "nama field" di form data
        if (file.fieldname === 'imageEvent') {
            uploadPath = 'uploads/events/';
        } else if (file.fieldname === 'photoProfile') {
            uploadPath = 'uploads/profiles/';
        } else if (file.fieldname === 'paymentProof') {
            uploadPath = 'uploads/payments/';
        }

        ensureDir(uploadPath); // Buat folder fisik jika belum ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Format nama file: TIMESTAMP-ANGKA_ACAK.EXT
        // Contoh: 1709882211-123456789.jpg
        // Tujuannya agar nama file tidak pernah kembar/bentrok
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. Filter File (Keamanan)
// Hanya menerima file gambar. Menolak PDF, EXE, dll.
const fileFilter = (req, file, cb) => {
    // Regex untuk tipe file yang diizinkan
    const allowedTypes = /jpeg|jpg|png|gif/;
    
    // Cek ekstensi file (misal: .jpg)
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Cek tipe MIME (misal: image/jpeg)
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Hanya diperbolehkan upload file gambar (jpg/jpeg/png)!'));
    }
};

// 4. Inisialisasi Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file maks 2MB
    fileFilter: fileFilter
});

module.exports = upload;