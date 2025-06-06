import React, { useEffect, useState } from 'react';

export const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('Admin');
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalMembers, setTotalMembers] = useState(0);
    const [activeLoans, setActiveLoans] = useState(0);
    const [overdueLoans, setOverdueLoans] = useState(0);
    const [recentLoans, setRecentLoans] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
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

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const booksResponse = await fetch('http://localhost:3002/books');
            const books = await booksResponse.json();
            setTotalBooks(books.length);
            setBooks(books);

            const membersResponse = await fetch('http://localhost:3001/members');
            const members = await membersResponse.json();
            setTotalMembers(members.length);
            setMembers(members);

            const loansResponse = await fetch('http://localhost:3003/loans');
            const loans = await loansResponse.json();

            const activeLoans = loans.filter(loan => !loan.return_date);
            setActiveLoans(activeLoans.length);

            const today = new Date();
            const overdueLoans = activeLoans.filter(loan => new Date(loan.due_date) < today);
            setOverdueLoans(overdueLoans.length);

            setRecentLoans(loans.sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date)).slice(0, 5));
            setNewMembers(members.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('isAdmin');
        window.location.href = '/admin_login';
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
                                        <a href="#" className="flex items-center p-2 rounded bg-purple-900">
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
                                        <a href="/admin_loans" className="flex items-center p-2 rounded hover:bg-purple-700">
                                            <i className="fas fa-exchange-alt mr-2"></i>
                                            <span>Loans</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <span className="text-white font-medium">{adminName}</span>
                                </div>
                                <button onClick={handleLogout} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded">
                                    <i className="fas fa-sign-out-alt mr-1"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                    <i className="fas fa-book text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm">Total Books</h3>
                                    <p className="text-2xl font-semibold">{totalBooks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="rounded-full bg-green-100 p-3 text-green-600">
                                    <i className="fas fa-users text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm">Total Members</h3>
                                    <p className="text-2xl font-semibold">{totalMembers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                                    <i className="fas fa-book-reader text-xl"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm">Active Loans</h3>
                                    <p className="text-2xl font-semibold">{activeLoans}</p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Recent Loans</h3>
                                <a href="#" className="text-purple-600 text-sm hover:underline">View All</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-sm">
                                            <th className="py-2 px-3">Book</th>
                                            <th className="py-2 px-3">Author</th>
                                            <th className="py-2 px-3">Member</th>
                                            <th className="py-2 px-3">Date</th>
                                            <th className="py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentLoans.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-center text-gray-500">No loans found</td>
                                            </tr>
                                        ) : (
                                            recentLoans.map((loan, index) => {
                                                const book = books.find(b => b.book_id === loan.book_id);
                                                const member = members.find(m => m.member_id === loan.member_id);
                                                const dueDate = new Date(loan.due_date);
                                                const today = new Date();
                                                let status = '';
                                                let statusClass = '';
                                                if (dueDate < today) {
                                                    status = 'Overdue';
                                                    statusClass = 'text-red-600 bg-red-100';
                                                } else {
                                                    status = loan.status || 'Active';
                                                    statusClass = 'text-blue-600 bg-blue-100';
                                                }
                                                return (
                                                    <tr key={index} className="border-b border-gray-100">
                                                        <td className="py-2 px-3">{book ? book.title : 'Unknown'}</td>
                                                        <td className="py-2 px-3">{book ? book.author || 'Unknown Author' : 'Unknown Author'}</td>
                                                        <td className="py-2 px-3">{member ? member.name : 'Unknown'}</td>
                                                        <td className="py-2 px-3">{new Date(loan.loan_date).toLocaleDateString()}</td>
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
                                <h3 className="text-lg font-semibold">New Members</h3>
                                <a href="#" className="text-purple-600 text-sm hover:underline">View All</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-sm">
                                            <th className="py-2 px-3">Name</th>
                                            <th className="py-2 px-3">Email</th>
                                            <th className="py-2 px-3">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newMembers.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="py-4 text-center text-gray-500">No members found</td>
                                            </tr>
                                        ) : (
                                            newMembers.map((member, index) => (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-2 px-3">{member.name}</td>
                                                    <td className="py-2 px-3">{member.email}</td>
                                                    <td className="py-2 px-3">{new Date(member.created_at || Date.now()).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};