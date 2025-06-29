export const LandingPage = () => {
    return (
        <div>
            <header class="bg-white shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center">
                                <i class="fas fa-book-open text-indigo-600 text-2xl mr-2"></i>
                                <span class="font-bold text-xl text-gray-800">Library Management System</span>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <a href="member_login" class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Login</a>
                            <a href="member_register" class="bg-indigo-600 text-white hover:bg-indigo-700 ml-4 px-4 py-2 rounded-md text-sm font-medium">Register</a>
                        </div>
                    </div>
                </div>
            </header>

            <section class="bg-indigo-700 text-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 class="text-4xl font-bold mb-6">Discover a World of Knowledge</h1>
                            <p class="text-xl mb-8">Our Library Management System makes it easy to browse, borrow, and manage books. Join our community of readers today!</p>
                            <div class="flex space-x-4">
                                <a href="member_register" class="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium">Get Started</a>
                                <a href="#features" class="border border-white text-white hover:bg-indigo-800 px-6 py-3 rounded-md font-medium">Learn More</a>
                            </div>
                        </div>
                        <div class="hidden lg:block">
                            {/* <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Library Books" class="rounded-lg shadow-xl"> */}
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" class="py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">Features</h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Our library management system offers a variety of features to enhance your reading experience.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <div class="w-12 h-12 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <i class="fas fa-search text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Easy Book Search</h3>
                            <p class="text-gray-600">Find books quickly using our advanced search system. Search by title, author, genre, or ISBN.</p>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <div class="w-12 h-12 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <i class="fas fa-book-reader text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Loan Management</h3>
                            <p class="text-gray-600">Borrow books with ease and manage your loans. Receive notifications for due dates and returns.</p>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <div class="w-12 h-12 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <i class="fas fa-history text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Reading History</h3>
                            <p class="text-gray-600">Keep track of your reading history and get personalized book recommendations based on your interests.</p>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <div class="w-12 h-12 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <i class="fas fa-bell text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Notifications</h3>
                            <p class="text-gray-600">Receive timely notifications about due dates, new arrivals, and special events at the library.</p>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <div class="w-12 h-12 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <i class="fas fa-mobile-alt text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Mobile Friendly</h3>
                            <p class="text-gray-600">Access the library system from any device, anywhere. Our platform is fully responsive.</p>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <div class="w-12 h-12 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <i class="fas fa-user-shield text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Secure Access</h3>
                            <p class="text-gray-600">Your personal information and reading history are kept secure with our advanced security measures.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-gray-100 py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Getting started with our library system is simple and straightforward.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                            <h3 class="text-xl font-semibold mb-2">Create an Account</h3>
                            <p class="text-gray-600">Register for a free account to access all features of our library management system.</p>
                        </div>

                        <div class="text-center">
                            <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                            <h3 class="text-xl font-semibold mb-2">Browse the Catalog</h3>
                            <p class="text-gray-600">Search our extensive catalog to find books that interest you. Filter by genre, author, or availability.</p>
                        </div>

                        <div class="text-center">
                            <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                            <h3 class="text-xl font-semibold mb-2">Borrow and Read</h3>
                            <p class="text-gray-600">Borrow books and manage your loans through your personal dashboard. Return when you're done.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="bg-indigo-700 rounded-2xl shadow-xl overflow-hidden">
                        <div class="px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                <div>
                                    <h2 class="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
                                    <p class="text-xl text-indigo-100 mb-8">Join thousands of readers who are already using our library management system. Create your account today!</p>
                                    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                        <a href="member_register" class="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-center">Register Now</a>
                                        <a href="member_login" class="border border-white text-white hover:bg-indigo-800 px-6 py-3 rounded-md font-medium text-center">Login</a>
                                    </div>
                                </div>
                                <div class="hidden lg:block">
                                    {/* <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Reading Books" class="rounded-lg shadow-xl"> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <footer class="bg-gray-800 text-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Library Management System</h3>
                            <p class="text-gray-400 mb-4">A modern solution for libraries to manage their collections and serve their members efficiently.</p>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul class="space-y-2">
                                <li><a href="#" class="text-gray-400 hover:text-white">Home</a></li>
                                <li><a href="#features" class="text-gray-400 hover:text-white">Features</a></li>
                                <li><a href="member_login" class="text-gray-400 hover:text-white">Login</a></li>
                                <li><a href="member_register" class="text-gray-400 hover:text-white">Register</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold mb-4">Support</h3>
                            <ul class="space-y-2">
                                <li><a href="#" class="text-gray-400 hover:text-white">FAQ</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white">Help Center</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white">Contact Us</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold mb-4">Contact</h3>
                            <ul class="space-y-2 text-gray-400">
                                <li class="flex items-start">
                                    <i class="fas fa-map-marker-alt mt-1 mr-2"></i>
                                    <span>123 Library Street, Book City</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-envelope mt-1 mr-2"></i>
                                    <span>info@librarysystem.com</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-phone mt-1 mr-2"></i>
                                    <span>+1 234 567 890</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-gray-700 mt-10 pt-6 text-center">
                        <p class="text-gray-400">&copy; 2023 Library Management System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};