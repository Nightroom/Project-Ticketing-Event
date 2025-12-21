const Sequelize = require('sequelize');
require('dotenv').config();

// Inisialisasi koneksi Sequelize
const db = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // <--- PENTING: Aiven pakai port khusus (bukan 3306)
        dialect: 'mysql',
        logging: false, 
        dialectOptions: {
            // <--- INI KUNCINYA SUPAYA AIVEN MAU KONEK
            ssl: {
                require: true,
                rejectUnauthorized: false // Memaksa Node.js menerima sertifikat Aiven
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Fungsi untuk mengetes koneksi dengan RETRY LOGIC
const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('✅ Koneksi ke database Aiven MySQL BERHASIL!');
    } catch (error) {
        console.error('❌ Gagal konek ke database.');
        console.error(`   Error: ${error.message}`);
        console.log('🔄 Mencoba lagi dalam 5 detik...');
        setTimeout(testConnection, 5000);
    }
};

testConnection();

module.exports = db;