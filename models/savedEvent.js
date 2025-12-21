const { DataTypes } = require('sequelize');
const db = require('../config/db');

const SavedEvent = db.define('SavedEvent', {
    SavedID: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    UserID: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    EventID: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    TanggalSimpan: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, { 
    tableName: 'SavedEvent', // Nama tabel di database MySQL
    timestamps: false 
});

module.exports = SavedEvent;