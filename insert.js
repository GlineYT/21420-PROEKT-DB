const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("library");

    // * Изчистване преди вмъкване (по избор)
    await db.collection("authors").deleteMany({});
    await db.collection("books").deleteMany({});
    await db.collection("users").deleteMany({});
    await db.collection("loans").deleteMany({});
    await db.collection("reviews").deleteMany({});

    //* Автори
    const authors = await db.collection("authors").insertMany([
      { _id: new ObjectId(), name: "George Orwell", birth_year: 1903, nationality: "British" },
      { _id: new ObjectId(), name: "J.K. Rowling", birth_year: 1965, nationality: "British" },
      { _id: new ObjectId(), name: "Stephen King", birth_year: 1947, nationality: "American" },
      { _id: new ObjectId(), name: "Agatha Christie", birth_year: 1890, nationality: "British" },
      { _id: new ObjectId(), name: "Ernest Hemingway", birth_year: 1899, nationality: "American" },
      { _id: new ObjectId(), name: "Jane Austen", birth_year: 1775, nationality: "British" },
      { _id: new ObjectId(), name: "Mark Twain", birth_year: 1835, nationality: "American" },
      { _id: new ObjectId(), name: "J.R.R. Tolkien", birth_year: 1892, nationality: "British" },
      { _id: new ObjectId(), name: "Fyodor Dostoevsky", birth_year: 1821, nationality: "Russian" },
      { _id: new ObjectId(), name: "Leo Tolstoy", birth_year: 1828, nationality: "Russian" }
    ]);

    //* Книги
    const books = await db.collection("books").insertMany([
      { title: "1984", author_id: authors.insertedIds[0], genre: "Dystopian", year: 1949, tags: ["politics", "classic"] },
      { title: "Harry Potter and the Sorcerer's Stone", author_id: authors.insertedIds[1], genre: "Fantasy", year: 1997, tags: ["magic", "adventure"] },
      { title: "The Shining", author_id: authors.insertedIds[2], genre: "Horror", year: 1977, tags: ["psychological", "classic"] },
      { title: "Murder on the Orient Express", author_id: authors.insertedIds[3], genre: "Mystery", year: 1934, tags: ["detective", "classic"] },
      { title: "The Old Man and the Sea", author_id: authors.insertedIds[4], genre: "Classic", year: 1952, tags: ["sea", "survival"] },
      { title: "Pride and Prejudice", author_id: authors.insertedIds[5], genre: "Romance", year: 1813, tags: ["society", "classic"] },
      { title: "The Adventures of Tom Sawyer", author_id: authors.insertedIds[6], genre: "Adventure", year: 1876, tags: ["childhood", "river"] },
      { title: "The Lord of the Rings", author_id: authors.insertedIds[7], genre: "Fantasy", year: 1954, tags: ["epic", "magic"] },
      { title: "Crime and Punishment", author_id: authors.insertedIds[8], genre: "Drama", year: 1866, tags: ["psychological", "classic"] },
      { title: "War and Peace", author_id: authors.insertedIds[9], genre: "Historical", year: 1869, tags: ["war", "Russia"] }
    ]);

    // *Потребители
    const users = await db.collection("users").insertMany([
      { _id: new ObjectId(), name: "Ivan Petrov", email: "ivan@abv.bg", registered: new Date(), preferences: ["Fantasy", "Sci-fi"] },
      { _id: new ObjectId(), name: "Maria Dimitrova", email: "maria@gmail.com", registered: new Date(), preferences: ["Classic", "Drama"] },
      { _id: new ObjectId(), name: "Georgi Ivanov", email: "georgi@yahoo.com", registered: new Date(), preferences: ["Horror", "Mystery"] },
      { _id: new ObjectId(), name: "Elena Petrova", email: "elena@abv.bg", registered: new Date(), preferences: ["Romance", "Classic"] },
      { _id: new ObjectId(), name: "Dimitar Georgiev", email: "dimi@gmail.com", registered: new Date(), preferences: ["Fantasy", "Adventure"] },
      { _id: new ObjectId(), name: "Petya Koleva", email: "petya@mail.bg", registered: new Date(), preferences: ["Drama", "History"] },
      { _id: new ObjectId(), name: "Nikolay Stoyanov", email: "nik@abv.bg", registered: new Date(), preferences: ["Sci-fi", "Classic"] },
      { _id: new ObjectId(), name: "Sofia Angelova", email: "sofia@gmail.com", registered: new Date(), preferences: ["Romance", "Mystery"] },
      { _id: new ObjectId(), name: "Kristina Mihaylova", email: "kris@gmail.com", registered: new Date(), preferences: ["Fantasy", "Historical"] },
      { _id: new ObjectId(), name: "Atanas Hristov", email: "atanas@mail.bg", registered: new Date(), preferences: ["Drama", "Horror"] }
    ]);

    // *Наеми
    await db.collection("loans").insertMany([
      { book_id: books.insertedIds[0], user_id: users.insertedIds[0], date_borrowed: new Date("2024-01-05"), returned: false },
      { book_id: books.insertedIds[1], user_id: users.insertedIds[1], date_borrowed: new Date("2024-02-10"), returned: true },
      { book_id: books.insertedIds[2], user_id: users.insertedIds[2], date_borrowed: new Date("2024-03-12"), returned: false },
      { book_id: books.insertedIds[3], user_id: users.insertedIds[3], date_borrowed: new Date("2024-04-01"), returned: true },
      { book_id: books.insertedIds[4], user_id: users.insertedIds[4], date_borrowed: new Date("2024-04-18"), returned: false },
      { book_id: books.insertedIds[5], user_id: users.insertedIds[5], date_borrowed: new Date("2024-05-05"), returned: true },
      { book_id: books.insertedIds[6], user_id: users.insertedIds[6], date_borrowed: new Date("2024-06-10"), returned: false },
      { book_id: books.insertedIds[7], user_id: users.insertedIds[7], date_borrowed: new Date("2024-07-15"), returned: true },
      { book_id: books.insertedIds[8], user_id: users.insertedIds[8], date_borrowed: new Date("2024-08-01"), returned: false },
      { book_id: books.insertedIds[9], user_id: users.insertedIds[9], date_borrowed: new Date("2024-09-03"), returned: false }
    ]);

    //*Рецензии
    await db.collection("reviews").insertMany([
      { user_id: users.insertedIds[0], book_id: books.insertedIds[0], rating: 5, comment: "Brilliant and terrifying.", date: new Date() },
      { user_id: users.insertedIds[1], book_id: books.insertedIds[1], rating: 4, comment: "Loved the magic and world.", date: new Date() },
      { user_id: users.insertedIds[2], book_id: books.insertedIds[2], rating: 5, comment: "Creepy and intense!", date: new Date() },
      { user_id: users.insertedIds[3], book_id: books.insertedIds[3], rating: 4, comment: "Classic mystery, well written.", date: new Date() },
      { user_id: users.insertedIds[4], book_id: books.insertedIds[4], rating: 3, comment: "Good, but a bit slow.", date: new Date() },
      { user_id: users.insertedIds[5], book_id: books.insertedIds[5], rating: 5, comment: "Timeless romance.", date: new Date() },
      { user_id: users.insertedIds[6], book_id: books.insertedIds[6], rating: 4, comment: "Fun and nostalgic.", date: new Date() },
      { user_id: users.insertedIds[7], book_id: books.insertedIds[7], rating: 5, comment: "Epic and unforgettable.", date: new Date() },
      { user_id: users.insertedIds[8], book_id: books.insertedIds[8], rating: 4, comment: "Deep and thought-provoking.", date: new Date() },
      { user_id: users.insertedIds[9], book_id: books.insertedIds[9], rating: 5, comment: "A masterpiece of literature.", date: new Date() }
    ]);

    console.log("Данните са вмъкнати успешно.");
  } catch (err) {
    console.error(" Грешка при вмъкване:", err);
  } finally {
    await client.close();
  }
}

seed();
