document.addEventListener("DOMContentLoaded", () => {
    const recordsTableBody = document.querySelector("#records-table tbody");

    // Função para obter registros do localStorage
    function getRegistersFromLocalStorage() {
        let registers = localStorage.getItem("register");
        return registers ? JSON.parse(registers) : [];
    }

    // Função para preencher a tabela de registros
    function populateRecordsTable() {
        const records = getRegistersFromLocalStorage();
        recordsTableBody.innerHTML = ""; // Limpa os registros existentes na tabela

        if (records.length === 0) {
            const noRecordsRow = document.createElement("tr");
            noRecordsRow.innerHTML = `<td colspan="5">Nenhum registro encontrado.</td>`;
            recordsTableBody.appendChild(noRecordsRow);
            return;
        }

        records.forEach((record, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.time}</td>
                <td>${record.type}</td>
                <td>${record.note || ""}</td>
                <td>
                    <button data-index="${index}" class="btn-edit">Editar</button>
                    <button data-index="${index}" class="btn-delete">Excluir</button>
                </td>
            `;
            recordsTableBody.appendChild(row);
        });
    }

    // Função para deletar um registro
    function deleteRegister(index) {
        let registers = getRegistersFromLocalStorage();
        registers.splice(index, 1); // Remove o registro pelo índice
        localStorage.setItem("register", JSON.stringify(registers));
        populateRecordsTable(); // Atualiza a tabela
    }

    // Adiciona eventos para os botões de edição e exclusão
    recordsTableBody.addEventListener("click", (event) => {
        const target = event.target;

        if (target.classList.contains("btn-delete")) {
            const index = target.getAttribute("data-index");
            deleteRegister(index);
        }
        // Adicionar lógica de edição aqui, se necessário
    });

    // Popula a tabela na inicialização
    populateRecordsTable();
});
