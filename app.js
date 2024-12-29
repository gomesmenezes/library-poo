import Biblioteca from './entity/libary.js'

const biblioteca = new Biblioteca();

// biblioteca.addBook('A startup enxuta: Como usar a inovação contínua para criar negócios radicalmente bem-sucedidos ', 'Eric Ries', 2019, '6f267a0d-72dd-4e8d-a078-a79a09ab7434')
// biblioteca.removeBook('d5652406-ea0d-42a0-9152-0d9a4953265e')
biblioteca.loanBook('3cf62bd5-e4b0-4890-961b-587caf2a8d65', '6f267a0d-72dd-4e8d-a078-a79a09ab7434')