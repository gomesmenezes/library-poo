import Livro from './book.js'
import pool from '../db.js'
import Loan from './loan.js'

export default class Biblioteca {
    constructor() {
        this.livros = []
    }

    async addBook(title, author, yearPublished, userId) {
        if (!title || !author || !yearPublished || !userId) {
            return console.log('Argumentos inválidos!');
        }

        try {
            const newBook = new Livro(title, author, yearPublished, true);

            const connection = await pool.getConnection();
            const query = `
                INSERT INTO livros (id, title, author, yearPublished, isAvailable, added_by_user_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await connection.execute(query, [
                newBook._id,
                newBook._title,
                newBook._author,
                newBook._yearPublished,
                newBook._avaible,
                userId,
            ]);

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

    async loanBook(id, userId) {
        try {
            const connection = await pool.getConnection();
    
            const [rows] = await connection.query(
                'SELECT * FROM livros WHERE id = ? AND isAvailable = 1',
                [id]
            );
    
            if (rows.length === 0) {
                console.log(`Livro com ID ${id} não encontrado ou não disponível.`);
                throw new Error('Livro não encontrado ou não disponível para empréstimo.');
            }
    
            // Atualizar disponibilidade do livro
            await connection.execute('UPDATE livros SET isAvailable = 0 WHERE id = ?', [id]);
    
            // Criar novo empréstimo
            const loan = new Loan(id, userId);
    
            const query = `
                INSERT INTO emprestimos (id, livro_id, user_id, data_emprestimo, data_devolucao)
                VALUES (?, ?, ?, ?, ?)
            `;
    
            await connection.execute(query, [
                loan.id, 
                loan.livroId, 
                loan.userId, 
                loan.dataEmprestimo, 
                loan.dataDevolucao
            ]);
    
            connection.release();
    
            console.log('Empréstimo registrado com sucesso.');
            return loan;
    
        } catch (error) {
            console.error('Erro ao registrar empréstimo:', error);
            throw error; // Re-throwing the error to be handled elsewhere if necessary
        }
    }
}
