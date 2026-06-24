/**
 * SPRINT 1 - ALMOXARIFADO DE ENFERMAGEM
 * Código totalmente comentado para mapeamento e criação do histórico de commits do Git.
 */

// URL base da sua MockAPI na nuvem. Mantenha o final do endpoint (ex: /materiais)
const API_URL = "https://SUA_MOCK_API_ID.mockapi.io/materiais";

// =========================================================================
// [CONTRATO TÉCNICO] CAPTURA DOS ELEMENTOS DO DOM (HTML)
// =========================================================================
// Captura o input onde a enfermeira digita o nome do insumo
const inputNome = document.getElementById("input-nome"); 
// Captura o input onde é inserida a quantidade física do material
const inputQuantidade = document.getElementById("input-quantidade"); 
// Captura o botão que dispara a ação de salvar os dados na nuvem
const btnCadastrar = document.getElementById("btn-cadastrar"); 
// Captura o corpo da tabela onde os materiais de enfermagem serão injetados
const listaMateriais = document.getElementById("lista-materiais"); 


// =========================================================================
// [CONEXÃO GET] BUSCAR E ATUALIZAR INVENTÁRIO MÉDICO
// =========================================================================

// Função assíncrona responsável por buscar a lista de insumos direto na API (Nuvem)
async function buscarMateriais() {
    try {
        // Envia uma requisição HTTP GET padrão para o endereço da MockAPI
        const response = await fetch(API_URL);
        
        // Verifica se a resposta da rede foi bem-sucedida, caso contrário, gera um erro
        if (!response.ok) throw new Error("Erro ao acessar base de dados hospitalar");
        
        // Converte os dados brutos recebidos da API para o formato JSON (Array de Objetos)
        const materiais = await response.json();
        
        // Dispara a função auxiliar para desenhar/atualizar os dados na tela do usuário
        renderizarLista(materiais);
    } catch (error) {
        // Exibe o erro detalhado no console do navegador para depuração
        console.error("Erro na requisição GET do estoque:", error);
        // Avisa visualmente o operador do sistema sobre a falha na comunicação
        alert("Falha ao carregar o inventário de enfermagem.");
    }
}

// Função auxiliar que manipula o DOM para desenhar as linhas da tabela HTML
function renderizarLista(materiais) {
    // Limpa os registros anteriores da tabela para evitar duplicação visual de dados
    listaMateriais.innerHTML = ""; 

    // Validação de segurança: se a API retornar um estoque vazio, exibe aviso amigável
    if (materiais.length === 0) {
        listaMateriais.innerHTML = `<tr><td colspan="3" style="text-align:center; color: #d9534f;">⚠️ Nenhum insumo médico cadastrado no momento.</td></tr>`;
        return;
    }

    // Laço de repetição que varre cada material vindo do banco de dados (MockAPI)
    materiais.forEach(material => {
        // Cria dinamicamente um elemento de linha de tabela (<tr>)
        const row = document.createElement("tr");
        
        // Injeta a estrutura de colunas (<td>) com os dados reais do insumo hospitalar
        row.innerHTML = `
            <td><strong>#${material.id}</strong></td>
            <td>${material.nome}</td>
            <td>${material.quantidade} und</td>
        `;
        
        // Adiciona a linha recém-criada dentro do container oficial mapeado (#lista-materiais)
        listaMateriais.appendChild(row);
    });
}


// =========================================================================
// [CONEXÃO POST] ENTRADA DE NOVOS MATERIAIS / LOTES
// =========================================================================

// Função assíncrona executada quando o botão de cadastro é clicado
async function cadastrarMaterial() {
    // Captura o texto do input de nome e remove espaços inúteis nas pontas (.trim)
    const nome = inputNome.value.trim();
    // Captura o valor do input de quantidade e converte text em número inteiro (parseInt)
    const quantidade = parseInt(inputQuantidade.value);

    // Validação preventiva de formulário para impedir o envio de campos vazios ou inválidos
    if (!nome || isNaN(quantidade)) {
        alert("Erro: Preencha a descrição do insumo e a quantidade corretamente.");
        return;
    }

    // Monta o objeto JavaScript estruturado com as chaves que a API espera receber
    const novoMaterial = {
        nome: nome,
        quantidade: quantidade
    };

    try {
        // Desabilita o botão temporariamente para evitar cliques duplos e cadastros repetidos na API
        btnCadastrar.disabled = true; 
        
        // Envia a requisição HTTP POST contendo o novo item de enfermagem no corpo (body)
        const response = await fetch(API_URL, {
            method: "POST", // Define o método HTTP de criação
            headers: {
                "Content-Type": "application/json" // Informa à API que estamos transmitindo um dado JSON
            },
            body: JSON.stringify(novoMaterial) // Transforma o objeto JS em texto JSON puro para tráfego na rede
        });

        // Caso a API rejeite o salvamento, dispara uma exceção para o bloco catch
        if (!response.ok) throw new Error("Erro ao salvar insumo no sistema");

        // Sucesso total no cadastro: Limpa os campos de texto para a próxima entrada de insumos
        inputNome.value = "";
        inputQuantidade.value = "";

        // Atualiza a visualização do painel chamando a função GET novamente de forma automática
        await buscarMateriais();

    } catch (error) {
        // Log de erro focado na requisição de persistência (POST)
        console.error("Erro no processamento de entrada (POST):", error);
        alert("Erro ao registrar a entrada do material hospitalar.");
    } finally {
        // Reativa o botão de cadastro após o término de todo o ciclo (seja sucesso ou falha)
        btnCadastrar.disabled = false;
    }
}


// =========================================================================
// ESCUTADORES DE EVENTOS (TRIGGERS DE EXECUÇÃO)
// =========================================================================

// Configura o botão de cadastrar para ouvir o evento de 'clique' e rodar a função de POST
btnCadastrar.addEventListener("click", cadastrarMaterial);

// Evento do sistema que monitora o carregamento da página. Assim que a tela abre, roda o GET
document.addEventListener("DOMContentLoaded", buscarMateriais);