const mysql = require('mysql2/promise');

// Konfigurasi database untuk Book Service
const bookDbConfig = {
    host: process.env.BOOK_DB_HOST || 'books-db',
    user: 'root',
    port: process.env.BOOK_DB_PORT || 3306,
    password: '',
    database: 'books',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Konfigurasi database untuk Member Service
const memberDbConfig = {
    host: process.env.MEMBER_DB_HOST || 'member-db',
    user: 'root',
    port: process.env.MEMBER_DB_PORT || 3306,
    password: '',
    database: 'member',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Konfigurasi database untuk Loan Service
const loanDbConfig = {
    host: process.env.LOAN_DB_HOST || 'loans-db',
    user: 'root',
    port: process.env.LOAN_DB_PORT || 3306,
    password: '',
    database: 'loans',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Konfigurasi database untuk Admin Service
const adminDbConfig = {
    host: process.env.ADMIN_DB_HOST || 'admin-db',
    user: 'root',
    port: process.env.ADMIN_DB_PORT || 3306,
    password: '',
    database: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Membuat pool koneksi
const bookDb = mysql.createPool(bookDbConfig);
const memberDb = mysql.createPool(memberDbConfig);
const loanDb = mysql.createPool(loanDbConfig);
const adminDb = mysql.createPool(adminDbConfig);

// Fungsi untuk mengecek koneksi ke database
async function checkDatabaseConnection() {
    try {
        // Cek koneksi ke Book Database
        await bookDb.query('SELECT 1');
        console.log('Book Database terhubung!');

        // Cek koneksi ke Member Database
        await memberDb.query('SELECT 1');
        console.log('Member Database terhubung!');

        // Cek koneksi ke Loan Database
        await loanDb.query('SELECT 1');
        console.log('Loan Database terhubung!');

        // Cek koneksi ke Admin Database
        await adminDb.query('SELECT 1');
        console.log('Admin Database terhubung!');

        return true;
    } catch (error) {
        console.error('Error koneksi database:', error);
        return false;
    }
}

module.exports = {
    bookDb,
    memberDb,
    loanDb,
    adminDb,
    checkDatabaseConnection
}; 