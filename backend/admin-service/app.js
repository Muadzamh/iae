// AdminService - app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { adminDb } = require('./db');

const app = express();
const PORT = 3004;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Konfigurasi URL service lain
const LOAN_SERVICE_URL = 'http://localhost:3003';

// Cek koneksi database
adminDb.query('SELECT 1')
  .then(async () => {
    console.log('Admin DB terhubung. Service siap digunakan');
    // Pastikan tabel `admin` ada. Jika belum, buat otomatis.
    try {
      await adminDb.query(`CREATE TABLE IF NOT EXISTS admin (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`);
      console.log('Tabel admin siap.');
    } catch (err) {
      console.error('Gagal membuat tabel admin:', err);
    }
  })
  .catch(err => {
    console.error('Gagal terhubung ke Admin DB:', err);
  });

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'admin-service' });
});

// Routes
// Get all admins
app.get('/admins', async (req, res) => {
  try {
    const [rows] = await adminDb.query('SELECT admin_id, name, email, created_at FROM admin');
    res.json(rows);
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ message: 'Failed to get admins' });
  }
});

// Get admin by ID
app.get('/admins/:id', async (req, res) => {
  try {
    const [rows] = await adminDb.query(
      'SELECT admin_id, name, email, created_at FROM admin WHERE admin_id = ?', 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting admin:', error);
    res.status(500).json({ message: 'Failed to get admin' });
  }
});

// Create new admin
app.post('/admins', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  try {
    // Cek apakah email sudah digunakan
    const [existingAdmin] = await adminDb.query('SELECT * FROM admin WHERE email = ?', [email]);
    
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Buat admin baru
    const [result] = await adminDb.query(
      'INSERT INTO admin (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, password] // Note: Sebaiknya password di-hash terlebih dahulu untuk keamanan
    );
    
    const [newAdmin] = await adminDb.query(
      'SELECT admin_id, name, email, created_at FROM admin WHERE admin_id = ?', 
      [result.insertId]
    );
    
    res.status(201).json(newAdmin[0]);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
});

// Login admin
app.post('/admins/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const [rows] = await adminDb.query('SELECT * FROM admin WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    
    const admin = rows[0];
    
    // Verifikasi password (sebaiknya diubah menggunakan bcrypt untuk keamanan)
    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Return admin tanpa password
    const { password: _, ...adminWithoutPassword } = admin;
    res.json(adminWithoutPassword);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// Update admin
app.put('/admins/:id', async (req, res) => {
  const { name, email } = req.body;
  
  try {
    // Cek apakah admin ada
    const [existingAdmin] = await adminDb.query('SELECT * FROM admin WHERE admin_id = ?', [req.params.id]);
    
    if (existingAdmin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Update data admin
    await adminDb.query(
      'UPDATE admin SET name = ?, email = ? WHERE admin_id = ?',
      [
        name || existingAdmin[0].name,
        email || existingAdmin[0].email,
        req.params.id
      ]
    );
    
    // Ambil data admin yang sudah diupdate
    const [updatedAdmin] = await adminDb.query(
      'SELECT admin_id, name, email, created_at FROM admin WHERE admin_id = ?', 
      [req.params.id]
    );
    
    res.json(updatedAdmin[0]);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Failed to update admin' });
  }
});

// Delete admin
app.delete('/admins/:id', async (req, res) => {
  try {
    // Cek apakah admin ada
    const [existingAdmin] = await adminDb.query(
      'SELECT admin_id, name, email, created_at FROM admin WHERE admin_id = ?', 
      [req.params.id]
    );
    
    if (existingAdmin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Hapus admin
    await adminDb.query('DELETE FROM admin WHERE admin_id = ?', [req.params.id]);
    
    res.json({ message: 'Admin deleted successfully', admin: existingAdmin[0] });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
});

// Admin get pending loans
app.get('/admin/pending-loans', async (req, res) => {
  try {
    // Get pending loans from loan service
    const response = await axios.get(`${LOAN_SERVICE_URL}/loans/status/pending`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting pending loans:', error);
    res.status(500).json({ message: 'Failed to get pending loans' });
  }
});

// Admin approve/reject loan
app.put('/admin/loans/:id/approve', async (req, res) => {
  const { approved } = req.body;
  
  if (approved === undefined) {
    return res.status(400).json({ message: 'Approval status is required' });
  }
  
  try {
    // Call loan service to approve/reject loan
    const response = await axios.put(`${LOAN_SERVICE_URL}/loans/${req.params.id}/approve`, { approved });
    res.json(response.data);
  } catch (error) {
    console.error('Error approving/rejecting loan:', error);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({ message: 'Failed to approve/reject loan' });
  }
});

// Admin get all loans
app.get('/admin/loans', async (req, res) => {
  try {
    // Get all loans from loan service
    const response = await axios.get(`${LOAN_SERVICE_URL}/loans`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting loans:', error);
    res.status(500).json({ message: 'Failed to get loans' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin service running on port ${PORT}`);
}); 