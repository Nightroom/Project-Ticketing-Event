const express = require('express');
const cors = require('cors');
const path = require('path'); // Tambahan: Untuk mengatur path folder
const db = require('./config/db');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// [PENTING] Set Folder 'uploads' menjadi Static / Public
// Agar gambar bisa diakses via browser: http://localhost:3000/uploads/events/namafile.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- IMPORT MODELS ---
const User = require('./models/User');
const Event = require('./models/Event');         
const Pendaftaran = require('./models/Pendaftaran');
const SavedEvent = require('./models/SavedEvent');

// --- DEFINISI RELASI (ASSOCIATIONS) ---
// Ini memberi tahu Sequelize bagaimana tabel saling berhubungan (Join)

// 1. Relasi Pendaftaran (User <-> Event)
Pendaftaran.belongsTo(User, { foreignKey: 'UserID' });
Pendaftaran.belongsTo(Event, { foreignKey: 'EventID' });
User.hasMany(Pendaftaran, { foreignKey: 'UserID' });
Event.hasMany(Pendaftaran, { foreignKey: 'EventID' });

// 2. Relasi Saved/Wishlist (User <-> Event)
SavedEvent.belongsTo(User, { foreignKey: 'UserID' });
SavedEvent.belongsTo(Event, { foreignKey: 'EventID' });
User.hasMany(SavedEvent, { foreignKey: 'UserID' });
Event.hasMany(SavedEvent, { foreignKey: 'EventID' });

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const savedEventRoutes = require('./routes/savedEventRoutes'); // Route Baru

// --- GUNAKAN ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/saved', savedEventRoutes); // Endpoint: /api/saved

// --- START DATABASE (DENGAN RETRY LOGIC) ---
const startDatabase = async () => {
    try {
        await db.authenticate(); 
        // 'alter: true' akan menyesuaikan kolom tabel tanpa menghapus data
        await db.sync({ alter: true }); 
        console.log("✅ Database Ready & Tables Synced!");
    } catch (err) {
        console.error("❌ Gagal terhubung ke Database. Mencoba lagi dalam 5 detik...");
        console.error("   Error:", err.message);
        setTimeout(startDatabase, 5000);
    }
};

startDatabase();

// ROOT ENDPOINT
app.get('/', (req, res) => {
    res.send('Backend Ticketing System API is Running (With Uploads & Relations)...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));