const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inisialisasi koneksi Sequelize
const db = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, 
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
        console.log('✅ Koneksi ke database MySQL di Docker berhasil terhubung.');
    } catch (error) {
        console.error('❌ Gagal konek ke database (Database mungkin belum siap).');
        console.error(`   Error: ${error.message}`);
        console.log('🔄 Mencoba lagi dalam 5 detik...');
        
        // Coba panggil fungsi ini lagi setelah 5 detik (5000 ms)
        setTimeout(testConnection, 5000);
    }
};

// Jalankan tes koneksi
testConnection();

module.exports = db;