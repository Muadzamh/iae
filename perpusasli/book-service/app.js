// BookService - app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { bookDb, checkDatabaseConnection } = require('../config/db');

const app = express();
const PORT = 3002;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Cek koneksi database
checkDatabaseConnection()
  .then(() => {
    console.log('Database terhubung. Service siap digunakan');
  })
  .catch(err => {
    console.error('Gagal terhubung ke database:', err);
  });

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'book-service' });
});

// Routes
// Get all books
app.get('/books', async (req, res) => {
  try {
    const [rows] = await bookDb.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ message: 'Failed to get books' });
  }
});

// Get book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const [rows] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({ message: 'Failed to get book' });
  }
});

// Create new book
app.post('/books', async (req, res) => {
  const { title, isbn } = req.body;
  
  if (!title || !isbn) {
    return res.status(400).json({ message: 'Title and ISBN are required' });
  }
  
  try {
    const [result] = await bookDb.query(
      'INSERT INTO books (title, isbn, isLoaned, created_at) VALUES (?, ?, ?, NOW())',
      [title, isbn, 0]
    );
    
    const [newBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [result.insertId]);
    
    res.status(201).json(newBook[0]);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
});

// Update book
app.put('/books/:id', async (req, res) => {
  const { title, isbn } = req.body;
  
  try {
    // Cek apakah buku ada
    const [existingBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update data buku
    await bookDb.query(
      'UPDATE books SET title = ?, isbn = ? WHERE book_id = ?',
      [
        title || existingBook[0].title,
        isbn || existingBook[0].isbn,
        req.params.id
      ]
    );
    
    // Ambil data buku yang sudah diupdate
    const [updatedBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    res.json(updatedBook[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

// Update book loan status
app.put('/books/:id/loan-status', async (req, res) => {
  const { isLoaned } = req.body;
  
  if (isLoaned === undefined) {
    return res.status(400).json({ message: 'isLoaned status is required' });
  }
  
  try {
    // Cek apakah buku ada
    const [existingBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update status peminjaman buku
    // await bookDb.query(
    //   'UPDATE books SET isLoaned = ? WHERE book_id = ?',
    //   [isLoaned ? 1 : 0, req.params.id]
    // );
    
    // Ambil data buku yang sudah diupdate
    const [updatedBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    res.json(updatedBook[0]);
  } catch (error) {
    console.error('Error updating book loan status:', error);
    res.status(500).json({ message: 'Failed to update book loan status' });
  }
});

// Decrease book stock
app.put('/books/:id/decreaseStock', async (req, res) => {
  try {
    // Check if book exists
    const [existingBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Decrease stock by 1
    if (existingBook[0].stock <= 0) {
      return res.status(400).json({ message: 'No stock available' });
    }
    await bookDb.query('UPDATE books SET stock = stock - 1 WHERE book_id = ?', [req.params.id]);
    
    // Retrieve updated book data
    const [updatedBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    res.json(updatedBook[0]);
  } catch (error) {
    console.error('Error decreasing book stock:', error);
    res.status(500).json({ message: 'Failed to decrease book stock' });
  }
});

// Delete book
app.delete('/books/:id', async (req, res) => {
  try {
    // Cek apakah buku ada
    const [existingBook] = await bookDb.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Hapus buku
    await bookDb.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
    
    res.json({ message: 'Book deleted successfully', book: existingBook[0] });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Book service running on port ${PORT}`);
});