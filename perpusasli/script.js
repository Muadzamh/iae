// Konfigurasi base URL untuk microservices
const API_URLS = {
    MEMBER_SERVICE: 'http://localhost:3001',
    BOOK_SERVICE: 'http://localhost:3002',
    LOAN_SERVICE: 'http://localhost:3003'
};

// Status server
let serverStatus = {
    MEMBER_SERVICE: false,
    BOOK_SERVICE: false,
    LOAN_SERVICE: false
};

// Fungsi untuk mengelola error
function handleError(error) {
    console.error('Error:', error);
    if (error.message && error.message.includes('Failed to fetch')) {
        alert('Terjadi kesalahan koneksi ke server. Pastikan semua service sudah berjalan.');
    } else {
        alert('Terjadi kesalahan. Silakan coba lagi nanti.');
    }
}

// Fungsi untuk memeriksa status server
async function checkServerStatus() {
    const statuses = document.getElementById('server-status');
    if (!statuses) return;
    
    statuses.innerHTML = '';
    
    for (const [service, url] of Object.entries(API_URLS)) {
        try {
            const response = await fetch(`${url}/health`, { 
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 2000
            });
            
            serverStatus[service] = true;
            
            const statusElement = document.createElement('div');
            statusElement.className = 'px-2 py-1 text-xs rounded-md bg-green-100 text-green-800';
            statusElement.textContent = `${service}: Online`;
            statuses.appendChild(statusElement);
            
        } catch (error) {
            console.error(`${service} is not available:`, error);
            serverStatus[service] = false;
            
            const statusElement = document.createElement('div');
            statusElement.className = 'px-2 py-1 text-xs rounded-md bg-red-100 text-red-800';
            statusElement.textContent = `${service}: Offline`;
            statuses.appendChild(statusElement);
        }
    }
}

// ===== BOOK SERVICE API CALLS =====
async function getAllBooks() {
    try {
        if (!serverStatus.BOOK_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.BOOK_SERVICE) {
                throw new Error('Book Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.BOOK_SERVICE}/books`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return [];
    }
}

async function getBookById(bookId) {
    try {
        if (!serverStatus.BOOK_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.BOOK_SERVICE) {
                throw new Error('Book Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.BOOK_SERVICE}/books/${bookId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch book: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return null;
    }
}

// ===== MEMBER SERVICE API CALLS =====
async function getAllMembers() {
    try {
        if (!serverStatus.MEMBER_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.MEMBER_SERVICE) {
                throw new Error('Member Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.MEMBER_SERVICE}/members`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch members: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return [];
    }
}

async function getMemberById(memberId) {
    try {
        if (!serverStatus.MEMBER_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.MEMBER_SERVICE) {
                throw new Error('Member Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.MEMBER_SERVICE}/members/${memberId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch member: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return null;
    }
}

// ===== LOAN SERVICE API CALLS =====
async function getAllLoans() {
    try {
        if (!serverStatus.LOAN_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.LOAN_SERVICE) {
                throw new Error('Loan Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.LOAN_SERVICE}/loans`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch loans: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return [];
    }
}

async function createLoan(memberId, bookId, dueDate) {
    try {
        if (!serverStatus.LOAN_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.LOAN_SERVICE) {
                throw new Error('Loan Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.LOAN_SERVICE}/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                memberId,
                bookId,
                dueDate
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create loan: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return null;
    }
}

async function returnBook(loanId) {
    try {
        if (!serverStatus.LOAN_SERVICE) {
            await checkServerStatus();
            if (!serverStatus.LOAN_SERVICE) {
                throw new Error('Loan Service is not available');
            }
        }
        
        const response = await fetch(`${API_URLS.LOAN_SERVICE}/loans/${loanId}/return`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to return book: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
        return null;
    }
}

// ===== UI FUNCTIONS =====

// Update dashboard statistics
async function updateDashboardStats() {
    try {
        const [books, members, loans] = await Promise.all([
            getAllBooks(),
            getAllMembers(),
            getAllLoans()
        ]);
        
        // Update UI elements
        document.getElementById('total-books').textContent = books.length;
        document.getElementById('total-members').textContent = members.length;
        
        // Hanya tampilkan peminjaman yang masih aktif
        const activeLoans = loans.filter(loan => !loan.returnDate);
        document.getElementById('active-loans').textContent = activeLoans.length;
    } catch (error) {
        handleError(error);
    }
}

// Menampilkan daftar buku terbaru
async function displayRecentBooks() {
    try {
        const books = await getAllBooks();
        const booksTable = document.getElementById('books-table-body');
        
        // Kosongkan tabel
        booksTable.innerHTML = '';
        
        // Tampilkan 5 buku terbaru
        const recentBooks = books.slice(0, 5);
        
        recentBooks.forEach(book => {
            const row = document.createElement('tr');
            
            // Status buku (available atau on loan)
            const isAvailable = !book.isLoaned;
            const statusClass = isAvailable ? 
                'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800';
            const statusText = isAvailable ? 'Available' : 'On Loan';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${book.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${book.author}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${book.isbn}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href="#" class="text-blue-600 hover:text-blue-900 mr-3" onclick="viewBookDetails('${book.id}')">View</a>
                    ${isAvailable ? 
                        `<a href="#" class="text-indigo-600 hover:text-indigo-900" onclick="initiateBookLoan('${book.id}')">Loan</a>` : 
                        `<a href="#" class="text-gray-400 cursor-not-allowed">Loan</a>`
                    }
                </td>
            `;
            
            booksTable.appendChild(row);
        });
    } catch (error) {
        handleError(error);
    }
}

// Menampilkan daftar peminjaman terbaru
async function displayRecentLoans() {
    try {
        const loans = await getAllLoans();
        const loansTable = document.getElementById('loans-table-body');
        
        // Kosongkan tabel
        loansTable.innerHTML = '';
        
        // Dapatkan 5 peminjaman terbaru
        const recentLoans = loans.slice(0, 5);
        
        // Kita perlu mendapatkan informasi buku dan anggota
        for (const loan of recentLoans) {
            const [member, book] = await Promise.all([
                getMemberById(loan.memberId),
                getBookById(loan.bookId)
            ]);
            
            const row = document.createElement('tr');
            
            // Tentukan status peminjaman
            let statusClass, statusText;
            
            if (loan.status == 'returned') {
                statusClass = 'bg-gray-100 text-gray-800';
                statusText = 'Returned';
            } else {
                const today = new Date();
                const dueDate = new Date(loan.dueDate);
                
                if (dueDate < today) {
                    statusClass = 'bg-red-100 text-red-800';
                    statusText = 'Overdue';
                } else {
                    // Due dalam 3 hari
                    const threeDaysFromNow = new Date();
                    threeDaysFromNow.setDate(today.getDate() + 3);
                    
                    if (dueDate <= threeDaysFromNow) {
                        statusClass = 'bg-yellow-100 text-yellow-800';
                        statusText = 'Due Soon';
                    } else {
                        statusClass = 'bg-blue-100 text-blue-800';
                        statusText = 'Active';
                    }
                }
            }
            
            // Format tanggal untuk tampilan
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            };
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${member ? member.name : 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${book ? book.title : 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(loan.loanDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(loan.dueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${!loan.returnDate ? 
                        `<a href="#" class="text-green-600 hover:text-green-900" onclick="returnBookLoan('${loan.id}')">Return</a>` : 
                        '<span class="text-gray-400">Returned</span>'
                    }
                </td>
            `;
            
            loansTable.appendChild(row);
        }
    } catch (error) {
        handleError(error);
    }
}

// Fungsi untuk mengembalikan buku
async function returnBookLoan(loanId) {
    if (confirm('Apakah Anda yakin ingin mengembalikan buku ini?')) {
        const result = await returnBook(loanId);
        if (result) {
            alert('Buku berhasil dikembalikan');
            // Refresh data
            updateDashboardStats();
            displayRecentLoans();
            displayRecentBooks();
        }
    }
}

// Fungsi untuk memulai peminjaman buku
async function initiateBookLoan(bookId) {
    // Dalam aplikasi nyata, ini akan membuka form untuk memilih member dan tanggal pengembalian
    // Untuk contoh sederhana, kita akan menggunakan prompt
    
    // Dapatkan semua anggota untuk dipilih
    const members = await getAllMembers();
    
    if (members.length === 0) {
        alert('Tidak ada anggota yang tersedia');
        return;
    }
    
    const memberSelection = members.map((m, idx) => `${idx+1}. ${m.name} (ID: ${m.id})`).join('\n');
    
    const memberInput = prompt(`Pilih anggota untuk peminjaman:\n${memberSelection}\n\nMasukkan nomor anggota:`);
    
    if (!memberInput) return;
    
    const memberIdx = parseInt(memberInput) - 1;
    if (isNaN(memberIdx) || memberIdx < 0 || memberIdx >= members.length) {
        alert('Pilihan anggota tidak valid');
        return;
    }
    
    const memberId = members[memberIdx].id;
    
    // Tentukan tanggal pengembalian (default: 14 hari dari sekarang)
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14);
    
    const dueDateStr = dueDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    const dueDateInput = prompt(`Masukkan tanggal pengembalian (format: YYYY-MM-DD):`, dueDateStr);
    
    if (!dueDateInput) return;
    
    // Buat peminjaman
    const result = await createLoan(memberId, bookId, dueDateInput);
    
    if (result) {
        alert('Buku berhasil dipinjamkan');
        // Refresh data
        updateDashboardStats();
        displayRecentLoans();
        displayRecentBooks();
    }
}

// Fungsi untuk melihat detail buku
function viewBookDetails(bookId) {
    // Dalam aplikasi nyata, ini akan membuka halaman detail buku atau modal
    alert(`Melihat detail buku dengan ID: ${bookId}`);
}

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', async () => {
    // Periksa status server
    await checkServerStatus();
    
    // Perbarui UI jika semua service berjalan
    try {
        // Update UI dengan data dari API
        await updateDashboardStats();
        await displayRecentBooks();
        await displayRecentLoans();
    } catch (error) {
        console.error('Failed to initialize page:', error);
    }
    
    // Setup event listeners
    document.getElementById('view-all-books').addEventListener('click', () => {
        alert('Menampilkan semua buku');
        // Dalam aplikasi nyata, ini akan berpindah ke halaman daftar buku
    });
    
    document.getElementById('view-all-members').addEventListener('click', () => {
        alert('Menampilkan semua anggota');
        // Dalam aplikasi nyata, ini akan berpindah ke halaman daftar anggota
    });
    
    document.getElementById('view-all-loans').addEventListener('click', () => {
        alert('Menampilkan semua peminjaman');
        // Dalam aplikasi nyata, ini akan berpindah ke halaman daftar peminjaman
    });
}); 