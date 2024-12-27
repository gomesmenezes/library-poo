import Livro from './book.js'
import pool from '../db.js'

export default class Biblioteca {
    constructor() {
        this.livros = []
    }

    async addBook(title, author, yearPublished) {
        if (!title || !author || !yearPublished) {
            return console.log('Argumentos inválidos!');
        }

        try {
            const newBook = new Livro(title, author, yearPublished, true);

            const connection = await pool.getConnection();
            const query = 'INSERT INTO livros (id, title, author, yearPublished, isAvailable) VALUES (?, ?, ?, ?, ?)';

            await connection.execute(query, [newBook.id, newBook.title, newBook.author, newBook.yearPublished, newBook.avaible]);
            connection.release();

            this.livros.push(newBook);
            console.log('Sucesso: Livro adicionado à estante.');

        } catch (error) {
            console.error('Erro ao adicionar o livro:', error);
        }
    }

    async removeBook(id) {
        try {
            const connection = await pool.getConnection();

            const query = 'DELETE FROM livros WHERE id = ?';
            await connection.execute(query, [id]);

            connection.release();

            this.livros = this.livros.filter((book) => book.id !== id);

            console.log(`Sucesso: Livro removido com sucesso. ID: ${id}`);
        } catch (error) {
            console.error('Erro ao remover o livro:', error);
        }
    }

    async updateBook(id, title, author, yearPublished, isAvailable) {
        try {
            if (!id || !title || !author || !yearPublished || isAvailable === undefined) {
                console.log('Erro: Argumentos inválidos!');
                return;
            }
    
            const connection = await pool.getConnection();
            const query = `
                UPDATE livros 
                SET title = ?, author = ?, yearPublished = ?, isAvailable = ?
                WHERE id = ?;
            `;
    
            const [result] = await connection.execute(query, [title, author, yearPublished, isAvailable, id]);
            connection.release();
    
            if (result.affectedRows > 0) {
                console.log(`Sucesso: Livro com ID ${id} atualizado com sucesso.`);
            } else {
                console.log(`Erro: Livro com ID ${id} não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao atualizar o livro:', error);
        }
    }
    
    async listBooks() {
        try {
            const connection = await pool.getConnection(); 
            const [rows] = await connection.query('SELECT * FROM livros'); 
            connection.release(); 
    
            if (rows.length === 0) {
                console.log('Nenhum livro encontrado.');
            } else {
                rows.forEach((row) => {
                    console.log(`
                    ID: ${row.id}
                    Título: ${row.title}
                    Autor: ${row.author}
                    Ano de Publicação: ${row.yearPublished}
                    Disponível: ${row.isAvailable ? 'Sim' : 'Não'}
                    `);
                });
            }
        } catch (error) {
            console.error('Erro ao listar os livros:', error);
        }
    }
    
}
