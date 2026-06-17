const API_URL = "https://6a28c71d4e1e783349a5fbdb.mockapi.io/APIENFERMAGEM/Almoxarifado";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

async function carregarMateriais() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar materiais.");
        }

        const materiais = await resposta.json();

        listaMateriais.innerHTML = "";

        if (materiais.length === 0) {

            listaMateriais.innerHTML = `
                <tr>
                    <td colspan="2">Nenhum material cadastrado.</td>
                </tr>
            `;
            return;
        }

        materiais.forEach(material => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${material.name}</td>
                <td>${material.quantidade}</td>

                 <td>
            <input
                type="number"
                id="input-retirada"
                min="1"
                placeholder="Qtd">
        </td>

        <td>
            <button class="btn-baixar">
                Baixar
            </button>

            <button class="btn-excluir">
                Excluir
            </button>
        </td>
            `;

            listaMateriais.appendChild(linha);
        });

    } catch (erro) {

        console.error("Erro:", erro);

        listaMateriais.innerHTML = `
            <tr>
                <td colspan="2">Erro ao carregar materiais.</td>
            </tr>
        `;
    }
}

async function cadastrarMaterial() {

    const nome = inputNome.value.trim();
    const quantidade = inputQuantidade.value.trim();

    if (nome === "" || quantidade === "") {
        alert("Preencha todos os campos.");
        return;
    }

    try {

        btnCadastrar.disabled = true;
        btnCadastrar.textContent = "Cadastrando...";

        const novoMaterial = {
            name: nome,
            quantidade: Number(quantidade)
        };

        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoMaterial)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar material.");
        }

        inputNome.value = "";
        inputQuantidade.value = "";

        await carregarMateriais();

        alert("Material cadastrado com sucesso!");

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível cadastrar o material.");

    } finally {

        btnCadastrar.disabled = false;
        btnCadastrar.textContent = "Cadastrar Material";
    }
}

btnCadastrar.addEventListener("click", cadastrarMaterial);

document.addEventListener("DOMContentLoaded", () => {
    carregarMateriais();
});