import { v4 as uuidv4 } from 'uuid';

export default class Users {
    constructor(userName, passwordHash, email, role = 'user') {
        if (!userName || typeof userName !== 'string' || userName.trim() === '') {
            throw new Error('Invalid userName');
        }
        if (!passwordHash || typeof passwordHash !== 'string') {
            throw new Error('Invalid passwordHash');
        }
        const validRoles = ['admin', 'user'];
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role');
        }

        this._id = uuidv4();
        this._userName = userName;
        this._passwordHash = passwordHash;
        this._email = email;
        this._role = role;
        this._createdAt = new Date();
    }

    get id() {
        return this._id;
    }

    get userName() {
        return this._userName;
    }

    set userName(value) {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            throw new Error('Invalid userName');
        }
        this._userName = value;
    }

    get email() {
        return this._email;
    }

    set email(email) {
        this._email = email
    }

    get role() {
        return this._role;
    }

    set role(value) {
        const validRoles = ['admin', 'user'];
        if (!validRoles.includes(value)) {
            throw new Error('Invalid role');
        }
        this._role = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    toString() {
        return `User [ID: ${this._id}, Name: ${this._userName}, Email: ${this._email}, Role: ${this._role}, Created At: ${this._createdAt}]`;
    }
}
