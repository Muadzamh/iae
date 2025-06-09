const axios = require('axios');

// Konfigurasi URL service
const MEMBER_SERVICE_URL = 'http://localhost:3001';
const BOOK_SERVICE_URL = 'http://localhost:3002';
const LOAN_SERVICE_URL = 'http://localhost:3003';
const ADMIN_SERVICE_URL = 'http://localhost:3004';

const resolvers = {
  Query: {
    // Book queries
    books: async () => {
      try {
        const response = await axios.get(`${BOOK_SERVICE_URL}/books`);
        return response.data;
      } catch (error) {
        console.error('Error fetching books:', error);
        throw new Error('Failed to fetch books');
      }
    },
    book: async (_, { id }) => {
      try {
        const response = await axios.get(`${BOOK_SERVICE_URL}/books/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching book ${id}:`, error);
        throw new Error(`Failed to fetch book ${id}`);
      }
    },

    // Member queries
    members: async () => {
      try {
        const response = await axios.get(`${MEMBER_SERVICE_URL}/members`);
        return response.data;
      } catch (error) {
        console.error('Error fetching members:', error);
        throw new Error('Failed to fetch members');
      }
    },
    member: async (_, { id }) => {
      try {
        const response = await axios.get(`${MEMBER_SERVICE_URL}/members/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching member ${id}:`, error);
        throw new Error(`Failed to fetch member ${id}`);
      }
    },

    // Admin queries
    admins: async () => {
      try {
        const response = await axios.get(`${ADMIN_SERVICE_URL}/admins`);
        return response.data;
      } catch (error) {
        console.error('Error fetching admins:', error);
        throw new Error('Failed to fetch admins');
      }
    },
    admin: async (_, { id }) => {
      try {
        const response = await axios.get(`${ADMIN_SERVICE_URL}/admins/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching admin ${id}:`, error);
        throw new Error(`Failed to fetch admin ${id}`);
      }
    },

    // Loan queries
    loans: async () => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans`);
        return response.data;
      } catch (error) {
        console.error('Error fetching loans:', error);
        throw new Error('Failed to fetch loans');
      }
    },
    loan: async (_, { id }) => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching loan ${id}:`, error);
        throw new Error(`Failed to fetch loan ${id}`);
      }
    },
    loansByMember: async (_, { memberId }) => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/member/${memberId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching loans for member ${memberId}:`, error);
        throw new Error(`Failed to fetch loans for member ${memberId}`);
      }
    },
    loansByBook: async (_, { bookId }) => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/book/${bookId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching loans for book ${bookId}:`, error);
        throw new Error(`Failed to fetch loans for book ${bookId}`);
      }
    },
    overdueLoans: async () => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/status/overdue`);
        return response.data;
      } catch (error) {
        console.error('Error fetching overdue loans:', error);
        throw new Error('Failed to fetch overdue loans');
      }
    },
    pendingLoans: async () => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/status/pending`);
        return response.data;
      } catch (error) {
        console.error('Error fetching pending loans:', error);
        throw new Error('Failed to fetch pending loans');
      }
    },
  },

  Mutation: {
    // Book mutations
    createBook: async (_, { input }) => {
      try {
        const response = await axios.post(`${BOOK_SERVICE_URL}/books`, input);
        return response.data;
      } catch (error) {
        console.error('Error creating book:', error);
        throw new Error('Failed to create book');
      }
    },
    updateBook: async (_, { id, input }) => {
      try {
        const response = await axios.put(`${BOOK_SERVICE_URL}/books/${id}`, input);
        return response.data;
      } catch (error) {
        console.error(`Error updating book ${id}:`, error);
        throw new Error(`Failed to update book ${id}`);
      }
    },
    deleteBook: async (_, { id }) => {
      try {
        const response = await axios.delete(`${BOOK_SERVICE_URL}/books/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting book ${id}:`, error);
        throw new Error(`Failed to delete book ${id}`);
      }
    },

    // Member mutations
    createMember: async (_, { input }) => {
      try {
        const response = await axios.post(`${MEMBER_SERVICE_URL}/members`, input);
        return response.data;
      } catch (error) {
        console.error('Error creating member:', error);
        throw new Error('Failed to create member');
      }
    },
    updateMember: async (_, { id, input }) => {
      try {
        const response = await axios.put(`${MEMBER_SERVICE_URL}/members/${id}`, input);
        return response.data;
      } catch (error) {
        console.error(`Error updating member ${id}:`, error);
        throw new Error(`Failed to update member ${id}`, error);
      }
    },
    deleteMember: async (_, { id }) => {
      try {
        const response = await axios.delete(`${MEMBER_SERVICE_URL}/members/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting member ${id}:`, error);
        throw new Error(`Failed to delete member ${id}`);
      }
    },

    // Admin mutations
    createAdmin: async (_, { input }) => {
      try {
        const response = await axios.post(`${ADMIN_SERVICE_URL}/admins`, input);
        return response.data;
      } catch (error) {
        console.error('Error creating admin:', error);
        throw new Error('Failed to create admin');
      }
    },
    updateAdmin: async (_, { id, input }) => {
      try {
        const response = await axios.put(`${ADMIN_SERVICE_URL}/admins/${id}`, input);
        return response.data;
      } catch (error) {
        console.error(`Error updating admin ${id}:`, error);
        throw new Error(`Failed to update admin ${id}`);
      }
    },
    deleteAdmin: async (_, { id }) => {
      try {
        const response = await axios.delete(`${ADMIN_SERVICE_URL}/admins/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting admin ${id}:`, error);
        throw new Error(`Failed to delete admin ${id}`);
      }
    },

    // Loan mutations
    createLoan: async (_, { input }) => {
      try {
        const response = await axios.post(`${LOAN_SERVICE_URL}/loans`, input);
        return response.data;
      } catch (error) {
        console.error('Error creating loan:', error);
        throw new Error('Failed to create loan');
      }
    },
    returnLoan: async (_, { id }) => {
      try {
        const response = await axios.put(`${LOAN_SERVICE_URL}/loans/${id}/return`, {});
        return response.data;
      } catch (error) {
        console.error(`Error returning loan ${id}:`, error);
        throw new Error(`Failed to return loan ${id}`);
      }
    },
    approveLoan: async (_, { id, approved }) => {
      try {
        const response = await axios.put(`${LOAN_SERVICE_URL}/loans/${id}/approve`, { approved });
        return response.data;
      } catch (error) {
        console.error(`Error approving/rejecting loan ${id}:`, error);
        throw new Error(`Failed to approve/reject loan ${id}`);
      }
    },
    deleteLoan: async (_, { id }) => {
      try {
        const response = await axios.delete(`${LOAN_SERVICE_URL}/loans/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting loan ${id}:`, error);
        throw new Error(`Failed to delete loan ${id}`);
      }
    },
  },

  // Field resolvers
  Book: {
    loans: async (parent) => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/book/${parent.book_id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching loans for book ${parent.book_id}:`, error);
        return [];
      }
    },
  },

  Member: {
    loans: async (parent) => {
      try {
        const response = await axios.get(`${LOAN_SERVICE_URL}/loans/member/${parent.member_id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching loans for member ${parent.member_id}:`, error);
        return [];
      }
    },
  },

  Loan: {
    member: async (parent) => {
      try {
        const response = await axios.get(`${MEMBER_SERVICE_URL}/members/${parent.member_id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching member ${parent.member_id}:`, error);
        return null;
      }
    },
    book: async (parent) => {
      try {
        const response = await axios.get(`${BOOK_SERVICE_URL}/books/${parent.book_id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching book ${parent.book_id}:`, error);
        return null;
      }
    },
  },
};

module.exports = { resolvers };
