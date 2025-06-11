import React, { useState, useEffect } from 'react';

export const AdminLoans = () => {
    const [adminName, setAdminName] = useState('Admin');
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            window.location.href = '/admin_login';
            return;
        }

        const adminName = localStorage.getItem('adminName');
        setAdminName(adminName || 'Admin');

        fetchAndDisplayLoans();
    }, []);

    const fetchAndDisplayLoans = async () => {
        try {
            const [loansResponse, booksResponse, membersResponse] = await Promise.all([
                fetch('http://localhost:3003/loans'),
                fetch('http://localhost:3002/books'),
                fetch('http://localhost:3001/members')
            ]);

            const loans = await loansResponse.json();
            const books = await booksResponse.json();
            const members = await membersResponse.json();

            setLoans(loans);
            setBooks(books);
            setMembers(members);
        } catch (error) {
            console.error('Error fetching loans data:', error);
            alert('Error loading loans data. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('isAdmin');
        window.location.href = '/admin_login';
    };

    const handleAcceptLoan = async (loanId, bookId) => {
        try {
            const loanApproveResponse = await fetch(`http://localhost:3003/loans/${loanId}/approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });

            if (!loanApproveResponse.ok) {
                const errorText = await loanApproveResponse.text();
                throw new Error(`Failed to approve loan: ${errorText}`);
            }

            alert('Loan request accepted successfully');
            fetchAndDisplayLoans();
        } catch (error) {
            console.error('Error accepting loan:', error);
            alert('Error accepting loan: ' + error.message);
        }
    };

    const handleRejectLoan = async (loanId) => {
        if (!confirm('Are you sure you want to reject this loan request?')) return;

        try {
            const response = await fetch(`http://localhost:3003/loans/${loanId}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Failed to reject loan request');

            alert('Loan request rejected successfully');
            fetchAndDisplayLoans();
        } catch (error) {
            console.error('Error rejecting loan:', error);
            alert('Error rejecting loan. Please try again.');
        }
    };

    const handleReturnLoan = async (loanId, bookId) => {
        try {
            const returnLoanResponse = await fetch(`http://localhost:3003/loans/${loanId}/return`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (!returnLoanResponse.ok) {
                const errorText = await returnLoanResponse.text();
                throw new Error(`Failed to return book: ${errorText}`);
            }

            alert('Loan marked as returned successfully');
            fetchAndDisplayLoans();
        } catch (error) {
            console.error('Error marking loan as returned:', error);
            alert('Error updating loan: ' + error.message);
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
                                        <a href="/admin_books" className="flex items-center p-2 rounded hover:bg-purple-700">
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
                                        <a href="#" className="flex items-center p-2 rounded bg-purple-900">
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
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Loan Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm">
                                        <th className="py-2 px-3">Book Title</th>
                                        <th className="py-2 px-3">Member</th>
                                        <th className="py-2 px-3">Loan Date</th>
                                        <th className="py-2 px-3">Due Date</th>
                                        <th className="py-2 px-3">Status</th>
                                        <th className="py-2 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">No loans found</td>
                                        </tr>
                                    ) : (
                                        loans.sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date)).map((loan) => {
                                            const book = books.find(b => b.book_id === loan.book_id);
                                            const member = members.find(m => m.member_id === loan.member_id);
                                            let status = '';
                                            let statusClass = '';
                                            let actionButtons = null;

                                            if (loan.status == null) {
                                                status = 'Requested';
                                                statusClass = 'text-blue-600 bg-yellow-100';
                                                actionButtons = (
                                                    <>
                                                        <button onClick={() => handleAcceptLoan(loan.loan_id, loan.book_id)} className="accept-loan-btn bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mr-1">
                                                            Accept
                                                        </button>
                                                        <button onClick={() => handleRejectLoan(loan.loan_id)} className="reject-loan-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                                            Reject
                                                        </button>
                                                    </>
                                                );
                                            } else if (loan.status === 'active') {
                                                const dueDate = new Date(loan.due_date);
                                                const today = new Date();
                                                if (dueDate < today) {
                                                    status = 'Overdue';
                                                    statusClass = 'text-red-600 bg-red-100';
                                                } else {
                                                    status = 'Active';
                                                    statusClass = 'text-blue-600 bg-blue-100';
                                                }
                                                actionButtons = (
                                                    <button onClick={() => handleReturnLoan(loan.loan_id, loan.book_id)} className="return-loan-btn bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs">
                                                        Mark Returned
                                                    </button>
                                                );
                                            } else {
                                                status = 'Returned';
                                                statusClass = 'text-green-600 bg-green-100';
                                            }

                                            return (
                                                <tr key={loan.loan_id} className="border-b border-gray-100">
                                                    <td className="py-2 px-3">{book ? book.title : 'Unknown'}</td>
                                                    <td className="py-2 px-3">{member ? member.name : 'Unknown'}</td>
                                                    <td className="py-2 px-3">{new Date(loan.loan_date).toLocaleDateString()}</td>
                                                    <td className="py-2 px-3">{loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="py-2 px-3"><span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>{status}</span></td>
                                                    <td className="py-2 px-3">{actionButtons}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};