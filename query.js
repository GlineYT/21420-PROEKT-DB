const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017"; // *Локален MongoDB сървър
const client = new MongoClient(uri);
//! Основна асинхронна функция run
async function run() {
  try {
    await client.connect();
    const db = client.db("library");
    //? Извличане на всички книги с информация за авторите им
    const booksWithAuthors = await db.collection("books").aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" }, //^  unwind превръща масив author във единичен обект
      {
        $project: {
          title: 1,
          genre: 1,
          year: 1,
          tags: 1,
          "author.name": 1,
          "author.nationality": 1
        }
      }
    ]).toArray();
    console.log("All books with authors:", JSON.stringify(booksWithAuthors, null, 2));
    //?  Извличане на книги от жанра "Fantasy" с авторите им
    const fantasyBooks = await db.collection("books").aggregate([
      { $match: { genre: "Fantasy" } },
      {
        $lookup: {
          from: "authors",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" }
    ]).toArray();
    console.log("\nFantasy books with authors:", JSON.stringify(fantasyBooks, null, 2));
    //? Извличане на ревюта за първата книга
    const firstBookId = (await db.collection("books").findOne({})?._id);
    if (firstBookId) {
      const bookWithReviews = await db.collection("books").aggregate([
        { $match: { _id: firstBookId } },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "book_id",
            as: "reviews"
          }
        },
        {
            //& Втори $lookup за извличане на ревюта
          $lookup: {
            from: "users",
            localField: "reviews.user_id",
            foreignField: "_id",
            as: "reviewers"
          }
        }
      ]).toArray();
      console.log("\nFirst book with reviews:", JSON.stringify(bookWithReviews, null, 2));
    }
    //? Средна оценка на книгите
    const avgRatings = await db.collection("reviews").aggregate([
      {
        $group: {
          _id: "$book_id",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $project: {
          bookTitle: "$book.title",
          averageRating: 1,
          reviewCount: 1
        }
      },
      { $sort: { averageRating: -1 } }
    ]).toArray();
    console.log("\nAverage ratings per book:", JSON.stringify(avgRatings, null, 2));
    //? Текущи заеми
    const currentLoans = await db.collection("loans").aggregate([
      { $match: { returned: false } },
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          "book.title": 1,
          "user.name": 1,
          date_borrowed: 1,
          daysOut: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), "$date_borrowed"] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      }
    ]).toArray();
    console.log("\nCurrent loans:", JSON.stringify(currentLoans, null, 2));
    //! Прихващане на грешки
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

run();