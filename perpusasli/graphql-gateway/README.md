# GraphQL API Gateway untuk Sistem Perpustakaan

API Gateway ini menggunakan GraphQL untuk mengintegrasikan semua layanan microservice sistem perpustakaan (book-service, member-service, loan-service) ke dalam satu endpoint.

## Instalasi

```bash
cd graphql-gateway
npm install
```

## Menjalankan Server

```bash
npm start
```

Server akan berjalan di http://localhost:3004/graphql

## Fitur

- GraphQL Playground untuk menguji query dan mutation
- Integrasi dengan semua layanan microservice
- Kemampuan untuk mengambil data dari beberapa layanan dalam satu query

## Contoh Query

### Mengambil semua buku

```graphql
query {
  books {
    book_id
    title
    author
    isLoaned
  }
}
```

### Mengambil detail buku beserta riwayat peminjaman

```graphql
query {
  book(id: "1") {
    book_id
    title
    author
    loans {
      loan_id
      loan_date
      return_date
      member {
        name
        email
      }
    }
  }
}
```

### Mengambil semua anggota beserta buku yang dipinjam

```graphql
query {
  members {
    member_id
    name
    email
    loans {
      loan_id
      loan_date
      book {
        title
        author
      }
    }
  }
}
```

## Contoh Mutation

### Membuat peminjaman baru

```graphql
mutation {
  createLoan(input: {
    member_id: "1",
    book_id: "2"
  }) {
    loan_id
    loan_date
    return_date
    member {
      name
    }
    book {
      title
    }
  }
}
```

### Mengembalikan buku

```graphql
mutation {
  returnLoan(id: "1") {
    loan_id
    return_date
    status
  }
}
```
