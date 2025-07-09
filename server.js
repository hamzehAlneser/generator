// app.js
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.get('/deploy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'deploy.html'));
});

app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.params.page + '.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});