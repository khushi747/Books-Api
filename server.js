const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: "password",      
    database: 'books', // Name of the database
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


//API ENDPOINTS
// Fetch all books
app.get('/api/books', (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Fetch a book by ID
app.get('/api/books/:id', (req, res) => {
    const query = 'SELECT * FROM books WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(results[0]);
    });
});

// Add a new book
app.post('/api/books', (req, res) => {
    const { title, author, published_date } = req.body;
    const query = 'INSERT INTO books (title, author, published_date) VALUES (?, ?, ?)';
    db.query(query, [title, author, published_date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, title, author, published_date });
    });
});

// Update an existing book
app.put('/api/books/:id', (req, res) => {
    const { title, author, published_date } = req.body;
    const query = 'UPDATE books SET title = ?, author = ?, published_date = ? WHERE id = ?';
    db.query(query, [title, author, published_date, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully' });
    });
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
    const query = 'DELETE FROM books WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    });
});




