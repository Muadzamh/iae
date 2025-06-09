const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Tipe untuk data buku
  type Book {
    book_id: ID!
    title: String!
    author: String!
    isbn: String!
    published_year: Int
    genre: String
    description: String
    cover_image: String
    isLoaned: Boolean
    loans: [Loan]
  }

  # Tipe untuk data anggota
  type Member {
    member_id: ID!
    name: String!
    email: String!
    password: String
    created_at: String
    isLoaning: Int
    loans: [Loan]
  }

  # Tipe untuk data admin
  type Admin {
    admin_id: ID!
    name: String!
    email: String!
    password: String
    created_at: String
  }

  # Tipe untuk data peminjaman
  type Loan {
    loan_id: ID!
    member_id: ID!
    book_id: ID!
    loan_date: String!
    return_date: String
    status: String
    member: Member
    book: Book
  }

  # Query root
  type Query {
    # Book queries
    books: [Book]
    book(id: ID!): Book
    
    # Member queries
    members: [Member]
    member(id: ID!): Member
    
    # Admin queries
    admins: [Admin]
    admin(id: ID!): Admin
    
    # Loan queries
    loans: [Loan]
    loan(id: ID!): Loan
    loansByMember(memberId: ID!): [Loan]
    loansByBook(bookId: ID!): [Loan]
    overdueLoans: [Loan]
    pendingLoans: [Loan]
  }

  # Input untuk membuat peminjaman baru
  input CreateLoanInput {
    member_id: ID!
    book_id: ID!
  }

  # Input untuk membuat buku baru
  input CreateBookInput {
    title: String!
    author: String!
    isbn: String!
    published_year: Int
    genre: String
    description: String
    cover_image: String
  }

  # Input untuk membuat anggota baru
  input CreateMemberInput {
    name: String!
    email: String!
    password: String
  }

    # Input untuk login member
  input MemberLoginInput {
    email: String!
    password: String!
  }


  # Input untuk membuat admin baru
  input CreateAdminInput {
    name: String!
    email: String!
    password: String!
  }

# Input untuk membuat update admin
  input UpdateAdminInput {
    name: String!
    email: String!
    password: String
  }

  # Input untuk login admin
  input AdminLoginInput {
    email: String!
    password: String!
  }

  # Mutation root
  type Mutation {
    # Book mutations
    createBook(input: CreateBookInput!): Book
    updateBook(id: ID!, input: CreateBookInput!): Book
    deleteBook(id: ID!): Book
    
    # Member mutations
    createMember(input: CreateMemberInput!): Member
    updateMember(id: ID!, input: CreateMemberInput!): Member
    deleteMember(id: ID!): Member
    loginMember(input: MemberLoginInput!): Member
    
    # Admin mutations
    createAdmin(input: CreateAdminInput!): Admin
    updateAdmin(id: ID!, input: UpdateAdminInput!): Admin
    deleteAdmin(id: ID!): Admin
    loginAdmin(input: AdminLoginInput!): Admin
    
    # Loan mutations
    createLoan(input: CreateLoanInput!): Loan
    returnLoan(id: ID!): Loan
    approveLoan(id: ID!, approved: Boolean!): Loan
    deleteLoan(id: ID!): Loan
  }
`;

module.exports = { typeDefs };
