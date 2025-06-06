import React, { useState } from 'react';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClass, setAlertClass] = useState('hidden');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3004/admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('adminId', data.admin_id);
            localStorage.setItem('adminName', data.name);
            localStorage.setItem('adminEmail', data.email);
            localStorage.setItem('isAdmin', 'true');

            window.location.href = '/admin_dashboard';

        } catch (error) {
            setAlertMessage(error.message || 'Failed to login. Please check your credentials.');
            setAlertClass('bg-red-100 text-red-800');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-purple-600">Admin Portal</h1>
                    <p className="text-gray-600">Library Management System</p>
                </div>

                <div id="alert" className={`${alertClass} mb-4 p-3 rounded text-sm`}>{alertMessage}</div>

                <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" name="email" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="password" name="password" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">Login</button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Member? <a href="member_login" className="text-blue-600 hover:underline">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};