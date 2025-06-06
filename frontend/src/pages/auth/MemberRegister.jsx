import React, { useState } from 'react';

export const MemberRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClass, setAlertClass] = useState('hidden');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !email) {
            setAlertMessage('Name and email are required');
            setAlertClass('bg-red-100 text-red-800');
            return;
        }

        if (password !== confirmPassword) {
            setAlertMessage('Passwords do not match');
            setAlertClass('bg-red-100 text-red-800');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setAlertMessage('Registration successful! Redirecting to login...');
            setAlertClass('bg-green-100 text-green-800');

            setTimeout(() => {
                window.location.href = '/member_login';
            }, 2000);

        } catch (error) {
            setAlertMessage(error.message);
            setAlertClass('bg-red-100 text-red-800');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">Library Management System</h1>
                    <p className="text-gray-600">Create a new account</p>
                </div>

                <div id="alert" className={`${alertClass} mb-4 p-3 rounded text-sm`}>{alertMessage}</div>

                <form id="register-form" className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="name" name="name" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

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
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <button type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? 
                        <a href="/member_login" className="text-blue-600 hover:underline">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};