import React, { useEffect, useState } from 'react';

export const MemberDashboard = () => {
    const [memberName, setMemberName] = useState('Member');
    const [currentLoans, setCurrentLoans] = useState([]);
    const [booksRead, setBooksRead] = useState(0);
    const [overdueLoans, setOverdueLoans] = useState(0);
    const [availableBooks, setAvailableBooks] = useState([]);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            window.location.href = '/admin_dashboard';
            return;
        }

        const memberId = localStorage.getItem('memberId');
        if (!memberId) {
            window.location.href = '/member_login';
            return;
        }

        const memberName = localStorage.getItem('memberName');
        setMemberName(memberName || 'Member');

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const memberId = localStorage.getItem('memberId');

            const loansResponse = await fetch(`http://localhost:3003/loans/member/${memberId}`);
            if (!loansResponse.ok) throw new Error('Failed to fetch loans data');
            const loans = await loansResponse.json();

            const booksResponse = await fetch('http://localhost:3002/books');
            if (!booksResponse.ok) throw new Error('Failed to fetch books data');
            const books = await booksResponse.json();

            const activeLoans = loans.filter(loan => !loan.actual_return_date).map(loan => {
                const book = books.find(b => b.book_id === loan.book_id);
                return {
                    ...loan,
                    title: book ? book.title : 'Unknown Title',
                    author: book ? book.author : 'Unknown Author'
                };
            });
            setCurrentLoans(activeLoans);

            const completedLoans = loans.filter(loan => loan.actual_return_date);
            setBooksRead(completedLoans.length);

            const today = new Date();
            const overdue = activeLoans.filter(loan => new Date(loan.due_date) < today);
            setOverdueLoans(overdue.length);

            setAvailableBooks(books.filter(book => book.stock >= 0));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            alert('Error loading data. Please try refreshing the page.');
        }
    };

    const handleLoanBook = async (bookId) => {
        const memberId = localStorage.getItem('memberId');
        if (!memberId) {
            alert('You must be logged in to loan a book');
            return;
        }
    
        try {
            // Cek stock buku terlebih dahulu
            const bookResponse = await fetch(`http://localhost:3002/books/${bookId}`);
            if (!bookResponse.ok) throw new Error('Failed to fetch book data');
            const book = await bookResponse.json();
            
            if (book.stock < 1) {
                alert('Sorry, this book is not available for loan');
                return;
            }
    
            const loanDate = new Date().toISOString().split('T')[0];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            const dueDateFormatted = dueDate.toISOString().split('T')[0];
    
            const loanData = {
                member_id: parseInt(memberId),
                book_id: parseInt(bookId),
                loan_date: loanDate,
                due_date: dueDateFormatted,
                status: 'active'
            };
    
            // Buat loan terlebih dahulu
            const loanResponse = await fetch('http://localhost:3003/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loanData)
            });
    
            if (!loanResponse.ok) {
                const errorData = await loanResponse.json();
                throw new Error(errorData.message || 'Failed to create loan');
            }
    
            // Setelah loan berhasil dibuat, baru kurangi stock
            const decreaseStockResponse = await fetch(`http://localhost:3002/books/${bookId}/decreaseStock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!decreaseStockResponse.ok) {
                const errorData = await decreaseStockResponse.json();
                throw new Error(errorData.message || 'Failed to update book stock');
            }
    
            alert('Book loaned successfully!');
            fetchDashboardData(); // Refresh data
    
        } catch (error) {
            console.error('Loan error:', error);
            alert(`Failed to loan book: ${error.message}`);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex flex-col h-screen">
                <header className="bg-blue-800 text-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold">Library Management System</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <span className="text-white font-medium">{memberName}</span>
                            </div>
                            <button onClick={() => {
                                localStorage.removeItem('memberId');
                                localStorage.removeItem('memberName');
                                localStorage.removeItem('memberEmail');
                                localStorage.removeItem('isAdmin');
                                window.location.href = '/member_login';
                            }} className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded">
                                <i className="fas fa-sign-out-alt mr-1"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Welcome, {memberName}!</h3>
                            <p className="text-gray-600">Welcome to the Library Management System. Here you can browse books and manage your loans.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                    <i className="fas fa-book-reader text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm">Current Loans</h3>
                                    <p className="text-2xl font-semibold">{currentLoans.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="rounded-full bg-green-100 p-3 text-green-600">
                                    <i className="fas fa-history text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm">Books Read</h3>
                                    <p className="text-2xl font-semibold">{booksRead}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="rounded-full bg-red-100 p-3 text-red-600">
                                    <i className="fas fa-exclamation-circle text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm">Overdue</h3>
                                    <p className="text-2xl font-semibold">{overdueLoans}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Current Loans</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm">
                                        <th className="py-2 px-3">Book Title</th>
                                        <th className="py-2 px-3">Author</th>
                                        <th className="py-2 px-3">Borrowed Date</th>
                                        <th className="py-2 px-3">Due Date</th>
                                        <th className="py-2 px-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentLoans.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-gray-500">You have no current loans</td>
                                        </tr>
                                    ) : (
                                        currentLoans.map((loan, index) => {
                                            const loanDate = new Date(loan.loan_date);
                                            const dueDate = new Date(loan.due_date);
                                            const today = new Date();
                                            let status = '';
                                            let statusClass = '';
                                            if (dueDate < today) {
                                                status = 'Overdue';
                                                statusClass = 'text-red-600 bg-red-100';
                                            } else {
                                                const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                                                if (daysLeft <= 2) {
                                                    status = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
                                                    statusClass = 'text-yellow-600 bg-yellow-100';
                                                } else {
                                                    status = `${daysLeft} days left`;
                                                    statusClass = 'text-blue-600 bg-blue-100';
                                                }
                                            }
                                            return (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-2 px-3">{loan.title || 'Unknown Title'}</td>
                                                    <td className="py-2 px-3">{loan.author || 'Unknown Author'}</td>
                                                    <td className="py-2 px-3">{loanDate.toLocaleDateString()}</td>
                                                    <td className="py-2 px-3">{dueDate.toLocaleDateString()}</td>
                                                    <td className="py-2 px-3"><span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>{status}</span></td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Available Books</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm">
                                        <th className="py-2 px-3">Title</th>
                                        <th className="py-2 px-3">Author</th>
                                        <th className="py-2 px-3">ISBN</th>
                                        <th className="py-2 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availableBooks.map((book, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-2 px-3">{book.title}</td>
                                            <td className="py-2 px-3">{book.author || 'Unknown Author'}</td>
                                            <td className="py-2 px-3">{book.isbn || 'N/A'}</td>
                                            <td className="py-2 px-3">
                                                <button 
                                                    onClick={() => handleLoanBook(book.book_id)}
                                                    className="loan-btn px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                                                    Loan
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};