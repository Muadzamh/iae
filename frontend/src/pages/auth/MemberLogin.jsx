import React, { useState } from 'react';

export const MemberLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClass, setAlertClass] = useState('hidden');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/members/login', {
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

            localStorage.setItem('memberId', data.member_id);
            localStorage.setItem('memberName', data.name);
            localStorage.setItem('memberEmail', data.email);
            localStorage.setItem('isAdmin', 'false');

            window.location.href = '/member_dashboard';

        } catch (error) {
            setAlertMessage(error.message || 'Failed to login. Please check your credentials.');
            setAlertClass('bg-red-100 text-red-800');
        }
    }

    return (   
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">Member Login</h1>
                    <p className="text-gray-600">Library Management System</p>
                </div>

                <div id="alert" className={`${alertClass} mb-4 p-3 rounded text-sm`}>{alertMessage}</div>

                <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" name="email" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="password" name="password" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <button type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Login
                        </button>
                    </div>
                </form>

                <div className="mt-4 flex justify-between text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                    <a href="/member_register" className="text-blue-600 hover:underline">Register</a>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Admin? <a href="/admin_login" className="text-blue-600 hover:underline">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};