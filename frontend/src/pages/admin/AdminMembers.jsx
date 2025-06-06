import React, { useState, useEffect } from 'react';

export const AdminMembers = () => {
    const [adminName, setAdminName] = useState('Admin');
    const [members, setMembers] = useState([]);
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            window.location.href = '/admin_login';
            return;
        }

        const adminName = localStorage.getItem('adminName');
        setAdminName(adminName || 'Admin');

        fetchAndDisplayMembers();
    }, []);

    const fetchAndDisplayMembers = async () => {
        try {
            const [membersResponse, loansResponse] = await Promise.all([
                fetch('http://localhost:3001/members'),
                fetch('http://localhost:3003/loans')
            ]);

            const members = await membersResponse.json();
            const loans = await loansResponse.json();

            setMembers(members);
            setLoans(loans);
        } catch (error) {
            console.error('Error fetching members data:', error);
            alert('Error loading members data. Please try again.');
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
                                        <a href="#" className="flex items-center p-2 rounded bg-purple-900">
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
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Member Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm">
                                        <th className="py-2 px-3">ID</th>
                                        <th className="py-2 px-3">Name</th>
                                        <th className="py-2 px-3">Email</th>
                                        <th className="py-2 px-3">Joined Date</th>
                                        <th className="py-2 px-3">Total Loans</th>
                                        <th className="py-2 px-3">Active Loans</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">No members found</td>
                                        </tr>
                                    ) : (
                                        members.sort((a, b) => a.member_id - b.member_id).map((member) => {
                                            const memberLoans = loans.filter(loan => loan.member_id === member.member_id);
                                            const activeLoans = memberLoans.filter(loan => !loan.return_date);
                                            return (
                                                <tr key={member.member_id} className="border-b border-gray-100">
                                                    <td className="py-2 px-3">{member.member_id}</td>
                                                    <td className="py-2 px-3">{member.name}</td>
                                                    <td className="py-2 px-3">{member.email}</td>
                                                    <td className="py-2 px-3">{new Date(member.created_at || Date.now()).toLocaleDateString()}</td>
                                                    <td className="py-2 px-3">{memberLoans.length}</td>
                                                    <td className="py-2 px-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${activeLoans.length > 0 ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'}`}>
                                                            {activeLoans.length}
                                                        </span>
                                                    </td>
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