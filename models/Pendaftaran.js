const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Pendaftaran = db.define('Pendaftaran', {
    PendaftaranID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserID: { type: DataTypes.INTEGER, allowNull: false },
    EventID: { type: DataTypes.INTEGER, allowNull: false },
    
    JumlahTiket: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1,
        validate: { min: 1 } 
    },
    TotalHarga: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false
    },
    MetodePembayaran: { 
        type: DataTypes.STRING
    },
    BuktiBayar: { 
        type: DataTypes.STRING
    },
    // --- UPDATE DI SINI: Tambahkan 'Verifying' ---
    StatusPembayaran: { 
        type: DataTypes.ENUM('Pending', 'Verifying', 'Paid', 'Failed'), 
        defaultValue: 'Pending' 
    },
    // ---------------------------------------------

    TanggalDaftar: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    StatusDaftar: { type: DataTypes.STRING, defaultValue: 'Berhasil' }
}, { tableName: 'pendaftaran', timestamps: false });

module.exports = Pendaftaran;