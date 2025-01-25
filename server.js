const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Path to the database file (JSON)
const DB_PATH = './db.json';

// Helper function to load the database
const loadDatabase = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

// Helper function to save the database
const saveDatabase = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Endpoint to update coins
app.post('/update', (req, res) => {
    const { userId, coins } = req.body;

    if (!userId || coins === undefined) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    const db = loadDatabase();
    db.users[userId] = coins; // Update or create user data
    saveDatabase(db);

    res.json({ message: 'Coins updated successfully', coins });
});

// Endpoint to get user coins
app.get('/get_coins/:userId', (req, res) => {
    const { userId } = req.params;

    const db = loadDatabase();
    const coins = db.users[userId] || 0;

    res.json({ coins });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
