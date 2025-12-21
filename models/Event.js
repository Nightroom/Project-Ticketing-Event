const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Event = db.define('Event', {
    EventID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NamaEvent: { type: DataTypes.STRING, allowNull: false },
    Deskripsi: { type: DataTypes.TEXT },
    TanggalEvent: { type: DataTypes.DATE, allowNull: false },
    Lokasi: { type: DataTypes.STRING },
    Kuota: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    
    // --- KOLOM BARU (Update sesuai Figma) ---
    Harga: { 
        type: DataTypes.DECIMAL(10, 2), 
        defaultValue: 0,
        comment: 'Harga tiket. 0 berarti Gratis.' 
    },
    Kategori: { 
        type: DataTypes.STRING, 
        comment: 'Contoh: Music, Game, Seminar' 
    },
    Image: { 
        type: DataTypes.STRING, 
        comment: 'Menyimpan nama file gambar poster event' 
    },
    // ----------------------------------------

    StatusEvent: { type: DataTypes.STRING, defaultValue: 'Aktif' }
}, { tableName: 'Event', timestamps: false });

module.exports = Event;