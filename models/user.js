const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = db.define('User', {
    UserID: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,    
        autoIncrement: true  
    },
    Nama: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    Email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true, 
        validate: { isEmail: true }
    },
    Password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    NoHP: { 
        type: DataTypes.STRING 
    },
    Role: { 
        type: DataTypes.ENUM('admin', 'user'), 
        defaultValue: 'User' 
    },
    
    // --- KOLOM BARU (Update) ---
    FotoProfil: { 
        type: DataTypes.STRING, 
        allowNull: true,
        comment: 'Menyimpan nama file foto profil user (misal: profile_123.jpg)'
    }
    // ---------------------------

}, {
    tableName: 'User',
    timestamps: false,
    hooks: {
        // Hook sebelum data dibuat (Hash Password)
        beforeCreate: async (user) => {
            if (user.Password) {
                const salt = await bcrypt.genSalt(10);
                user.Password = await bcrypt.hash(user.Password, salt);
            }
        },
        // Hook sebelum data diupdate (Hash Password jika berubah)
        beforeUpdate: async (user) => {
            if (user.changed('Password')) {
                const salt = await bcrypt.genSalt(10);
                user.Password = await bcrypt.hash(user.Password, salt);
            }
        }
    }
});

module.exports = User;