import {Author} from "../model/index.js";
import {sequelize} from "../config/database.js";

export const findPublishersByAuthor = async (req, res) => {
    try {
        const {author} = req.params;

        const authorRecord = await Author.findByPk(author);
        if (!authorRecord) {
            return res.status(404).json({error: "Author not found"});
        }

        const results = await sequelize.query(
            `SELECT DISTINCT b.publisher
             FROM books b
             JOIN books_authors ba ON b.isbn = ba.isbn
             WHERE ba.authorName = :authorName`, {
                replacements: {authorName: author},
                type: sequelize.QueryTypes.SELECT
            });
        // TODO distinct by field publisher
        // const books = await authorRecord.getBooks();
        // const publishers = [...new Set(books.map(book => book.publisher))];
        const publishers = results.map(row => row.publisher);
        return res.json(publishers);
    } catch (e) {
        console.error('Error finding publishers by author', e);
        return res.status(500).json({
            error: 'Failed to find publisher by author'
        })
    }
}