// LoanService - app.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { loanDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json()); // Gunakan express.json() yang merupakan standar baru
app.use(cors());

// Konfigurasi URL service lain
const MEMBER_SERVICE_URL = process.env.MEMBER_SERVICE_URL;
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL;

// Cek koneksi database
// Hanya cek koneksi ke Loan DB agar tidak error bila database lain belum siap
loanDb.query('SELECT 1')
  .then(async () => {
    console.log('Loan DB terhubung. Service siap digunakan');
    // Buat tabel `loans` jika belum ada agar sesuai struktur yang sudah Anda miliki
    try {
      await loanDb.query(`CREATE TABLE IF NOT EXISTS loans (
        loan_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        book_id INT NOT NULL,
        loan_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        return_date DATETIME DEFAULT NULL,
        status VARCHAR(8) DEFAULT NULL,
        admin_id INT DEFAULT NULL,
        due_date DATETIME NOT NULL,
        INDEX (member_id),
        INDEX (book_id)
      ) ENGINE=InnoDB`);
      console.log('Struktur tabel loans diverifikasi.');
    } catch (err) {
      console.error('Gagal membuat/verifikasi tabel loans:', err);
    }
  })
  .catch(err => {
    console.error('Gagal terhubung ke Loan DB:', err);
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

// Create new loan (Route dasar untuk '/loans')
app.post('/loans', async (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /loans hit. Body:`, req.body);
  const { member_id, book_id } = req.body;

  if (!member_id || !book_id) {
      return res.status(400).json({ message: 'Member ID and Book ID are required' });
  }

  try {
      await axios.get(`${MEMBER_SERVICE_URL}/members/${member_id}`);
      const bookResponse = await axios.get(`${BOOK_SERVICE_URL}/books/${book_id}`);
      const book = bookResponse.data;
  
      if (book.stock <= 0) {
          return res.status(400).json({ message: 'Book has no stock' });
      }
  
      const loanDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(loanDate.getDate() + 14);
  
      const [result] = await loanDb.query(
          'INSERT INTO loans (member_id, book_id, loan_date, due_date, status) VALUES (?, ?, ?, ?, ?)',
          [member_id, book_id, loanDate, dueDate, 'active']
      );
  
      const [newLoan] = await loanDb.query('SELECT * FROM loans WHERE loan_id = ?', [result.insertId]);
      res.status(201).json(newLoan[0]);

  } catch (error) {
      console.error('Error creating loan:', error.message);
      if (error.response) {
          return res.status(error.response.status).json({ message: error.response.data.message });
      }
      res.status(500).json({ message: 'Failed to create loan' });
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