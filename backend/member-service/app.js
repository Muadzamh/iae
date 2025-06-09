// MemberService - app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { memberDb } = require('./db');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Cek koneksi Member DB saja
memberDb.query('SELECT 1')
  .then(async () => {
    console.log('Member DB terhubung. Service siap digunakan');
    // Pastikan tabel `member` ada. Jika belum, buat otomatis.
    try {
      await memberDb.query(`CREATE TABLE IF NOT EXISTS member (
        member_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`);
      console.log('Tabel member siap.');
    } catch (err) {
      console.error('Gagal membuat tabel member:', err);
    }
  })
  .catch(err => console.error('Gagal terhubung ke Member DB:', err));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'member-service' });
});

// Routes
// Get all members
app.get('/members', async (req, res) => {
  try {
    const [rows] = await memberDb.query('SELECT member_id, name, email, created_at FROM member');
    res.json(rows);
  } catch (error) {
    console.error('Error getting members:', error);
    res.status(500).json({ message: 'Failed to get members' });
  }
});

// Get member by ID
app.get('/members/:id', async (req, res) => {
  try {
    const [rows] = await memberDb.query(
      'SELECT member_id, name, email, created_at FROM member WHERE member_id = ?', 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting member:', error);
    res.status(500).json({ message: 'Failed to get member' });
  }
});

// Create new member (register)
app.post('/members', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  try {
    // Cek apakah email sudah digunakan
    const [existingMember] = await memberDb.query('SELECT * FROM member WHERE email = ?', [email]);
    
    if (existingMember.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Buat member baru
    const [result] = await memberDb.query(
      'INSERT INTO member (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, password] // Note: Sebaiknya password di-hash terlebih dahulu untuk keamanan
    );
    
    const [newMember] = await memberDb.query(
      'SELECT member_id, name, email, created_at FROM member WHERE member_id = ?', 
      [result.insertId]
    );
    
    res.status(201).json(newMember[0]);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ message: 'Failed to create member' });
  }
});

// Login member
app.post('/members/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const [rows] = await memberDb.query('SELECT * FROM member WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const member = rows[0];
    
    // Verifikasi password (sebaiknya diubah menggunakan bcrypt untuk keamanan)
    if (member.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Return member tanpa password
    const { password: _, ...memberWithoutPassword } = member;
    res.json(memberWithoutPassword);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// Update member
app.put('/members/:id', async (req, res) => {
  const { name, email } = req.body;
  
  try {
    // Cek apakah member ada
    const [existingMember] = await memberDb.query('SELECT * FROM member WHERE member_id = ?', [req.params.id]);
    
    if (existingMember.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Update data member
    await memberDb.query(
      'UPDATE member SET name = ?, email = ? WHERE member_id = ?',
      [
        name || existingMember[0].name,
        email || existingMember[0].email,
        req.params.id
      ]
    );
    
    // Ambil data member yang sudah diupdate
    const [updatedMember] = await memberDb.query(
      'SELECT member_id, name, email, created_at FROM member WHERE member_id = ?', 
      [req.params.id]
    );
    
    res.json(updatedMember[0]);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Failed to update member' });
  }
});

// Delete member
app.delete('/members/:id', async (req, res) => {
  try {
    // Cek apakah member ada
    const [existingMember] = await memberDb.query(
      'SELECT member_id, name, email, created_at FROM member WHERE member_id = ?', 
      [req.params.id]
    );
    
    if (existingMember.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Hapus member
    await memberDb.query('DELETE FROM member WHERE member_id = ?', [req.params.id]);
    
    res.json({ message: 'Member deleted successfully', member: existingMember[0] });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Failed to delete member' });
  }
});

// Get member's loan history
app.get('/members/:id/loans', async (req, res) => {
  try {
    const memberId = req.params.id;
    
    // Cek apakah member ada
    const [existingMember] = await memberDb.query('SELECT * FROM member WHERE member_id = ?', [memberId]);
    
    if (existingMember.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Call LoanService to get member's loans
    try {
      const response = await axios.get(`http://localhost:3003/loans/member/${memberId}`);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching loans from loan-service:', error.message);
      res.status(500).json({ message: 'Failed to fetch loan history' });
    }
  } catch (error) {
    console.error('Error getting loan history:', error);
    res.status(500).json({ message: 'Failed to get loan history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Member service running on port ${PORT}`);
});