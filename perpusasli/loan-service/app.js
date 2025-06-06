// LoanService - app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { loanDb, checkDatabaseConnection } = require('../config/db');

const app = express();
const PORT = 3003;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Konfigurasi URL service lain
const MEMBER_SERVICE_URL = 'http://localhost:3001';
const BOOK_SERVICE_URL = 'http://localhost:3002';

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
  res.status(200).json({ status: 'ok', service: 'loan-service' });
});

// Routes
// Get all loans
app.get('/loans', async (req, res) => {
  try {
    const [rows] = await loanDb.query('SELECT * FROM loans');
    res.json(rows);
  } catch (error) {
    console.error('Error getting loans:', error);
    res.status(500).json({ message: 'Failed to get loans' });
  }
});

// Get loan by ID
app.get('/loans/:id', async (req, res) => {
  try {
    const [rows] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting loan:', error);
    res.status(500).json({ message: 'Failed to get loan' });
  }
});

// Get loans by member ID
app.get('/loans/member/:memberId', async (req, res) => {
  try {
    const [rows] = await loanDb.query('SELECT * FROM loans WHERE member_id = ?', [req.params.memberId]);
    res.json(rows);
  } catch (error) {
    console.error('Error getting member loans:', error);
    res.status(500).json({ message: 'Failed to get member loans' });
  }
});

// Get loans by book ID
app.get('/loans/book/:bookId', async (req, res) => {
  try {
    const [rows] = await loanDb.query('SELECT * FROM loans WHERE book_id = ?', [req.params.bookId]);
    res.json(rows);
  } catch (error) {
    console.error('Error getting book loans:', error);
    res.status(500).json({ message: 'Failed to get book loans' });
  }
});

// Create new loan
app.post('/loans', async (req, res) => {
  const { member_id, book_id } = req.body;
  
  if (!member_id || !book_id) {
    return res.status(400).json({ message: 'Member ID and Book ID are required' });
  }
  
  try {
    // Verifikasi member ada
    try {
      await axios.get(`${MEMBER_SERVICE_URL}/members/${member_id}`);
    } catch (err) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Verifikasi buku ada dan tersedia
    let bookResponse;
    try {
      bookResponse = await axios.get(`${BOOK_SERVICE_URL}/books/${book_id}`);
    } catch (err) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const book = bookResponse.data;
    
    if (book.stock == 0) {
      return res.status(400).json({ message: 'Book has no stock' });
    }
    
    // Set tanggal peminjaman dan pengembalian
    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(loanDate.getDate() + 14); // Due date 14 hari dari sekarang
    
    // Format tanggal ke YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Buat peminjaman baru
    const [result] = await loanDb.query(
      'INSERT INTO loans (member_id, book_id, loan_date, return_date, due_date, status) VALUES (?, ?, ?, ?, ?, NULL)',
      [member_id, book_id, formatDate(loanDate), null, formatDate(dueDate)]
    );
    
    // Ambil data peminjaman yang baru dibuat
    const [newLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [result.insertId]);
    
    res.status(201).json(newLoan[0]);
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Failed to create loan' });
  }
});

// Return book
app.put('/loans/:id/return', async (req, res) => {
  try {
    // Cek apakah peminjaman ada
    const [existingLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    
    if (existingLoan.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (existingLoan[0].status == 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }
    
    // Set tanggal pengembalian dan update status
    const returnDate = new Date().toISOString().split('T')[0];
    
    await loanDb.query(
      'UPDATE loans SET return_date = ?, status = ? WHERE loan_id = ?',
      [returnDate, 'returned', req.params.id]
    );
    
    // // Update status buku menjadi tersedia
    // await axios.put(`${BOOK_SERVICE_URL}/books/${existingLoan[0].book_id}/loan-status`, { isLoaned: false });
    
    // Ambil data peminjaman yang sudah diupdate
    const [updatedLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    
    res.json(updatedLoan[0]);
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Failed to return book' });
  }
});

// Get overdue loans
app.get('/loans/status/overdue', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const [rows] = await loanDb.query(
      'SELECT * FROM loans WHERE return_date < ? AND status = ?',
      [today, 'active']
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error getting overdue loans:', error);
    res.status(500).json({ message: 'Failed to get overdue loans' });
  }
});

// Get pending loans (untuk admin)
app.get('/loans/status/pending', async (req, res) => {
  try {
    const [rows] = await loanDb.query(
      'SELECT * FROM loans WHERE status is null'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error getting pending loans:', error);
    res.status(500).json({ message: 'Failed to get pending loans' });
  }
});

// Admin approve/reject loan
app.put('/loans/:id/approve', async (req, res) => {
  const { approved } = req.body;
  
  if (approved === undefined) {
    return res.status(400).json({ message: 'Approval status is required' });
  }
  
  try {
    // Cek apakah peminjaman ada
    const [existingLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    
    if (existingLoan.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (approved) {
      // Approve loan
      await loanDb.query(
        'UPDATE loans SET status = ? WHERE loan_id = ?',
        ['active', req.params.id]
      );
      
      // // Update status buku menjadi dipinjam
      // await axios.put(`${BOOK_SERVICE_URL}/books/${existingLoan[0].book_id}/loan-status`, { isLoaned: true });
    } else {
      // Reject loan
      await loanDb.query(
        'UPDATE loans SET status = ? WHERE loan_id = ?',
        ['rejected', req.params.id]
      );
    }
    
    // Ambil data peminjaman yang sudah diupdate
    const [updatedLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    
    res.json(updatedLoan[0]);
  } catch (error) {
    console.error('Error approving/rejecting loan:', error);
    res.status(500).json({ message: 'Failed to approve/reject loan' });
  }
});

// Delete loan (for admin purposes)
app.delete('/loans/:id', async (req, res) => {
  try {
    // Cek apakah peminjaman ada
    const [existingLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    
    if (existingLoan.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Hapus peminjaman
    await loanDb.query('DELETE FROM loans WHERE loan_id = ?', [req.params.id]);
    
    res.json({ message: 'Loan deleted successfully', loan: existingLoan[0] });
  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({ message: 'Failed to delete loan' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Loan service running on port ${PORT}`);
});