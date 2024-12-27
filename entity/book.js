import { v4 as uuidv4 } from 'uuid';

export default class Livro {
    constructor(title, author, yearPublished, avaible) {
        this._id = uuidv4();
        this._title = title;
        this._author = author;
        this._yearPublished = yearPublished;
        this._avaible = avaible
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    set title(title) {
        this._title = title;
    }

    get author() {
        return this._author;
    }

    set author(author) {
        this._author = author;
    }

    get yearPublished() {
        return this._yearPublished;
    }

    set yearPublished(yearPublished) {
        this._yearPublished = yearPublished;
    }

    get avaible() {
        return this._avaible;
    }

    set avaible(avaible) {
        this._avaible = avaible;
    }

    showDetails() {
        return `
        ID: ${this.id}
        Title book: ${this.title} 
        Author: ${this.author}
        Year Published: ${this.yearPublished}
        Avaible: ${this.avaible}
        `;
    }
}
