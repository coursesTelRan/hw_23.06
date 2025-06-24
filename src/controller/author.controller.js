import {Author, Book} from "../model/index.js";

export const findBookAuthors = async (req, res) => {
    try {
        const {isbn} = req.params;
        const book = await Book.findByPk(isbn);
        if (!book) {
            return res.status(404).json({error: "Book not found"});
        }
        const authors = await book.getAuthors();
        const response = authors.map(author => ({
            name: author.name,
            birthDate: author.birthDate
        }))
        return res.json(response);
    } catch (e) {
        console.error('Error finding book authors', e);
        return res.status(500).json({
            error: 'Failed to find book authors'
        })
    }
}
export const removeAuthor = async (req, res) => {
    try{
        const { author } = req.params;

        const authorToDelete = await Author.findOne({ where: { name: author } });

        if (!authorToDelete) {
            return res.status(404).json({ error: "Author not found" });
        }

        await authorToDelete.destroy();

        return res.json({ message: `Author '${author}' was deleted successfully` });
    }catch(err){
        console.error('Error remove author', err);
        return res.status(500).json({ error: "Failed to delete author" });
    }
}