import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export default class Loan {
    constructor(livroId, userId) {
        if (!livroId || !userId) {
            throw new Error('IDs inválidos para livro ou usuário');
        }

        this.id = uuidv4();
        this.livroId = livroId;
        this.userId = userId;
        this.dataEmprestimo = dayjs().format('YYYY-MM-DD HH:mm:ss');
        this.dataDevolucao = null;
    }

    setDevolucao() {
        this.dataDevolucao = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }
}
