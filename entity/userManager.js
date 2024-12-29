import bcrypt from 'bcrypt';
import pool from '../db.js';
import Users from './Users.js';

export default class UserManager {
    static async registerUser(userName, password, email, role = 'user') {
        let connection;
        try {
            connection = await pool.getConnection();

            // Verificar se o usuário já existe
            const [existingUser] = await connection.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            if (existingUser.length > 0) {
                throw new Error('email already exists.');
            }

            // Hash da senha
            const passwordHash = await bcrypt.hash(password, 10)

            // Criar novo usuário
            const user = new Users(userName, passwordHash, email, role);

            // Inserir no banco de dados
            await connection.execute(
                'INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                [user.id, userName, email, passwordHash, role, user.createdAt]
            );
            

            console.log('User registered successfully.');
        } catch (error) {
            console.error('Error during user registration:', error);
        } finally {
            if (connection) connection.release();
        }
    }

    static async authenticate(userName, password) {
        let connection;
        try {
            connection = await pool.getConnection();
    
            // Busca o usuário pelo nome
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE username = ?', // Corrigir para o nome exato da coluna
                [userName]
            );
            
            if (rows.length === 0) {
                throw new Error('User not found.');
            }
    
            const user = rows[0];
    
            // Verifique se o campo `password_hash` corresponde à coluna do banco
            if (!user.password_hash) {
                throw new Error('Password hash not found for user.');
            }
    
            // Compara a senha com o hash armazenado
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                throw new Error('Invalid credentials.');
            }
    
            console.log('User authenticated successfully.');
            console.log(user);
            
            return user; // Retorna o usuário autenticado
        } catch (error) {
            console.error('Authentication failed:', error);
        } finally {
            if (connection) connection.release();
        }
    }

    static async getUserInfo(userId) {
        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT id, userName, role, created_at FROM users WHERE id = ?',
                [userId]
            );
            if (rows.length === 0) {
                throw new Error('User not found.');
            }

            console.log(rows[0]);
            
            return rows[0]; // Retorna os dados públicos do usuário
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            connection.release();
        }
    }

    static async deleteUser(userId) {
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
                [userId]
            );
            console.log('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            connection.release();
        }
    }

    static async deleteUserPermanent(userId) {
        const connection = await pool.getConnection();
        try {
            // Deleta permanentemente o usuário do banco de dados
            await connection.execute(
                'DELETE FROM users WHERE id = ?',
                [userId]
            );
            console.log('User permanently deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            if (connection) connection.release();
        }
    }
    

}