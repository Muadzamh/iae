import React, { useState, useEffect } from 'react';

export const AdminBooks = () => {
    const [adminName, setAdminName] = useState('Admin');
    const [books, setBooks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
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
        setCurrentBook(book);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentBook(null);
    };

    const openConfirm = (book) => {
        setCurrentBook(book);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setCurrentBook(null);
    };

    const handleSaveBook = async (event) => {
        event.preventDefault();

        const bookData = {
            title: event.target.title.value,
            author: event.target.author.value,
            isbn: event.target.isbn.value,
            publisher: event.target.publisher.value,
            publication_year: parseInt(event.target.year.value) || null
        };

        try {
            let response;
            if (currentBook) {
                response = await fetch(`http://localhost:3002/books/${currentBook.book_id}`, {
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

            closeModal();
            alert(currentBook ? 'Book updated successfully' : 'Book added successfully');
            fetchAndDisplayBooks();
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Error saving book. Please try again.');
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
                                                <td className="py-2 px-3">{book.stock || 'N/A'}</td>
                                                <td className="py-2 px-3">
                                                    <button onClick={() => openModal(book)} className="text-blue-600 hover:text-blue-800 mr-2">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button onClick={() => openConfirm(book)} className="text-red-600 hover:text-red-800">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {modalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">{currentBook ? 'Edit Book' : 'Add New Book'}</h3>
                                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <form onSubmit={handleSaveBook}>
                                    <input type="hidden" name="book_id" defaultValue={currentBook ? currentBook.book_id : ''} />
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-1">Title</label>
                                        <input type="text" name="title" defaultValue={currentBook ? currentBook.title : ''} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="author" className="block text-gray-700 text-sm font-medium mb-1">Author</label>
                                        <input type="text" name="author" defaultValue={currentBook ? currentBook.author : ''} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="isbn" className="block text-gray-700 text-sm font-medium mb-1">ISBN</label>
                                        <input type="text" name="isbn" defaultValue={currentBook ? currentBook.isbn : ''} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="publisher" className="block text-gray-700 text-sm font-medium mb-1">Publisher</label>
                                        <input type="text" name="publisher" defaultValue={currentBook ? currentBook.publisher : ''} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="year" className="block text-gray-700 text-sm font-medium mb-1">Publication Year</label>
                                        <input type="number" name="year" defaultValue={currentBook ? currentBook.publication_year : ''} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2">
                                            Cancel
                                        </button>
                                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                                            Save Book
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

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