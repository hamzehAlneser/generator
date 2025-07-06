// app.js
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});