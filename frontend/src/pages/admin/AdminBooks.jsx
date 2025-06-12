import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const AdminBooks = () => {
    const [adminName, setAdminName] = useState('Admin');
    const [books, setBooks] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            window.location.href = '/admin_login';
            return;
        }

        const adminName = localStorage.getItem('adminName');
        setAdminName(adminName || 'Admin');

        fetchAndDisplayBooks();
    }, []);

    const fetchAndDisplayBooks = async () => {
        try {
            const response = await fetch('http://localhost:3002/books');
            const books = await response.json();
            setBooks(books);
        } catch (error) {
            console.error('Error fetching books data:', error);
            alert('Error loading books data. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('isAdmin');
        window.location.href = '/admin_login';
    };

    const openModal = (book = null) => {
        // Simpan book yang sedang diedit
        setCurrentBook(book);

        Swal.fire({
            title: book ? 'Edit Book' : 'Add New Book',
            html: `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; align-items: center;">
                        <label for="swal-title" style="width: 80px; text-align: left; margin-right: 10px;">Title</label>
                        <input id="swal-title" class="swal2-input" style="flex: 1;" placeholder="Title" value="${book ? book.title : ''}">
                    </div>
                    <div style="display: flex; align-items: center;">
                        <label for="swal-author" style="width: 80px; text-align: left; margin-right: 10px;">Author</label>
                        <input id="swal-author" class="swal2-input" style="flex: 1;" placeholder="Author" value="${book ? book.author : ''}">
                    </div>
                    <div style="display: flex; align-items: center;">
                        <label for="swal-isbn" style="width: 80px; text-align: left; margin-right: 10px;">ISBN</label>
                        <input id="swal-isbn" class="swal2-input" style="flex: 1;" placeholder="ISBN" value="${book ? book.isbn : ''}">
                    </div>
                    <div style="display: flex; align-items: center;">
                        <label for="swal-stock" style="width: 80px; text-align: left; margin-right: 10px;">Stock</label>
                        <input id="swal-stock" type="number" class="swal2-input" style="flex: 1;" placeholder="Stock" value="${book ? book.stock : ''}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value,
                    author: document.getElementById('swal-author').value,
                    isbn: document.getElementById('swal-isbn').value,
                    stock: document.getElementById('swal-stock').value,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const bookData = result.value;
                try {
                    let response;
                    if (book) {
                        response = await fetch(`http://localhost:3002/books/${book.book_id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bookData)
                        });
                    } else {
                        response = await fetch('http://localhost:3002/books', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bookData)
                        });
                    }

                    if (!response.ok) throw new Error('Failed to save book');

                    Swal.fire('Success', book ? 'Book updated successfully' : 'Book added successfully', 'success');
                    fetchAndDisplayBooks();
                } catch (error) {
                    console.error('Error saving book:', error);
                    Swal.fire('Error', 'Error saving book. Please try again.', 'error');
                }
            }
        });
    };

    const openConfirm = (book) => {
        setCurrentBook(book);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setCurrentBook(null);
    };

    const openWarehouse = async (book) => {
        try {
            const response = await fetch('/devtunnel/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query GetHistoryByBarang($idBarang: Int!) {
                            getHistoryByBarang(id_barang: $idBarang) {
                                id_barang
                                tanggal
                                tipe_transaksi
                                jumlah
                            }
                        }
                    `,
                    variables: { idBarang: book.book_id }
                })
            });
            const result = await response.json();
            if (result.data && result.data.getHistoryByBarang) {
                const history = result.data.getHistoryByBarang;
                const htmlContent = history.length === 0
                    ? '<p>Tidak ada riwayat inventaris di gudang.</p>'
                    : `<table class=\"min-w-full table-auto border\">\n                        <thead>\n                            <tr>\n                                <th class=\"px-4 py-2 border\">Tanggal</th>\n                                <th class=\"px-4 py-2 border\">Tipe Transaksi</th>\n                                <th class=\"px-4 py-2 border\">Jumlah</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ${history.map(item => `\n                                <tr>\n                                    <td class=\"px-4 py-2 border\">${new Date(item.tanggal).toLocaleString()}</td>\n                                    <td class=\"px-4 py-2 border\">${item.tipe_transaksi}</td>\n                                    <td class=\"px-4 py-2 border\">${item.jumlah}</td>\n                                </tr>`).join('')}\n                        </tbody>\n                    </table>`;

                Swal.fire({
                    title: `Riwayat Gudang - Buku ${book.title}`,
                    html: htmlContent,
                    width: 800,
                    showCloseButton: true,
                });
            } else {
                throw new Error('No data returned');
            }
        } catch (error) {
            console.error('Error fetching warehouse history:', error);
            Swal.fire('Error', 'Error fetching warehouse history. Please try again.', 'error');
        }
    };

    const handleDeleteBook = async () => {
        try {
            const response = await fetch(`http://localhost:3002/books/${currentBook.book_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete book');

            closeConfirm();
            alert('Book deleted successfully');
            fetchAndDisplayBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Error deleting book. Please try again.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex flex-col h-screen">
                <header className="bg-purple-800 text-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold">Library Management System</h1>
                            <h2 className="text-sm opacity-75">Admin Panel</h2>
                        </div>
                        <div className="flex items-center space-x-6">
                            <nav>
                                <ul className="flex space-x-4">
                                    <li>
                                        <a href="/admin_dashboard" className="flex items-center p-2 rounded hover:bg-purple-700">
                                            <i className="fas fa-tachometer-alt mr-2"></i>
                                            <span>Dashboard</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center p-2 rounded bg-purple-900">
                                            <i className="fas fa-book mr-2"></i>
                                            <span>Books</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/admin_members" className="flex items-center p-2 rounded hover:bg-purple-700">
                                            <i className="fas fa-users mr-2"></i>
                                            <span>Members</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/admin_loans" className="flex items-center p-2 rounded hover:bg-purple-700">
                                            <i className="fas fa-exchange-alt mr-2"></i>
                                            <span>Loans</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <div className="flex items-center space-x-4">
                                <span className="text-white font-medium">{adminName}</span>
                                <button onClick={handleLogout} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded">
                                    <i className="fas fa-sign-out-alt mr-1"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Book Management</h3>
                            <button onClick={() => openModal()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                                <i className="fas fa-plus mr-2"></i>Add New Book
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm">
                                        <th className="py-2 px-3">ID</th>
                                        <th className="py-2 px-3">Title</th>
                                        <th className="py-2 px-3">Author</th>
                                        <th className="py-2 px-3">ISBN</th>
                                        <th className="py-2 px-3">Stock</th>
                                        <th className="py-2 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">No books found</td>
                                        </tr>
                                    ) : (
                                        books.map((book) => (
                                            <tr key={book.book_id} className="border-b border-gray-100">
                                                <td className="py-2 px-3">{book.book_id}</td>
                                                <td className="py-2 px-3">{book.title}</td>
                                                <td className="py-2 px-3">{book.author || 'Unknown'}</td>
                                                <td className="py-2 px-3">{book.isbn || 'N/A'}</td>
                                                <td className="py-2 px-3">{book.stock || '0'}</td>
                                                <td className="py-2 px-3">
                                                    {/* Tombol Edit dan Delete akan selalu muncul */}
                                                    <button onClick={() => openModal(book)} className="text-blue-600 hover:text-blue-800 mr-2">
                                                    <i className="fas fa-edit mr-2"></i>Edit
                                                    </button>
                                                    <button onClick={() => openConfirm(book)} className="text-red-600 hover:text-red-800">
                                                    <i className="fas fa-trash mr-2"></i>Delete
                                                    </button>
                                                    {/* Tombol ini hanya muncul jika stok adalah 0 */}
                                                    {book.stock === 0 && (
                                                    <button onClick={() => openWarehouse(book)} className="text-yellow-600 hover:text-yellow-800 mr-2">
                                                        <i className="fas fa-warehouse mr-2"></i>Lihat Gudang
                                                    </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {confirmOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                                    <p className="text-gray-700 mt-2">Are you sure you want to delete this book? This action cannot be undone.</p>
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={closeConfirm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteBook} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};