import {
  GETMesas,
  DELETEMesa,
  POSTMesa,
  GETMesa,
  PUTMesa,
} from "./mesasApiScript.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Remove o botão imediatamente ao carregar o DOM
  let usuarioInfo = pegarInfoUsuarioLocalStorage();
  if (usuarioInfo.userId != 1) {
    removerBotaodeAdicionarItens();
  }

  const avatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");

  avatar.addEventListener("click", () => {
    logoutBtn.classList.toggle("show");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioInfo");
    window.location.href = "../login/index.html"; // Redireciona para a tela de login
  });

  // Continua o carregamento das mesas
  await montarItensLocalStorage();
});

// Adicionar os itens do Cardapio na tela
async function montarMesas(mesas = []) {
  let ulMesas = document.querySelector("ul");

  // Se houver itens, remova o item de carregamento
  if (mesas.length !== 0) {
    ulMesas.innerHTML = "";
  }

  let usuarioInfo = pegarInfoUsuarioLocalStorage();

  mesas.forEach((item) => {
    ulMesas.insertAdjacentHTML(
      "beforeend",
      `
       <li>
            <img src="../imgs/mesa-redonda.png" />
            <p>Mesa ${item.numeroMesa}</p>
            <p>Situacao: <span>${
              item.situacaoMesa === 0 ? "Livre" : "Ocupada"
            }</span></p>
            ${
              usuarioInfo.userId === 1
                ? `<div class="div-li-buttons">
              <button class="button-li" id="button-li-delete-${item.numeroMesa}">
                ❌
              </button>
              <button class="button-li"  id="button-li-editar-${item.numeroMesa}">
                ✏️
              </button>
            </div>`
                : ""
            }
            
          </li>
        `
    );

    if (usuarioInfo.userId === 1) {
      adicionarEventoCliqueDeletarBotaoItemCardapio(
        item.idMesa,
        item.numeroMesa
      );
      adicionarEventoCliqueEditarBotaoItemCardapio(
        item.idMesa,
        item.numeroMesa
      );
    }
  });
}

function removerBotaodeAdicionarItens() {
  let botaoAdicionar = document.querySelector("#button-adicionar-item");
  botaoAdicionar.remove();
}

// Adicionar um evento no input de pesquisar, para filtrar os itens na tela, mostrando somente os escritos
function filtrarItem() {
  const inputProcurar = document.querySelector("#input-procurar");

  inputProcurar.addEventListener("input", (event) => {
    const valorBusca = event.target.value;
    const cardapioItensLocalStorage = pegarItensLocalStorage();
    const itensFiltrados = cardapioItensLocalStorage.filter((item) => {
      return (
        String(item.numeroMesa).includes(valorBusca) ||
        String(item.situacaoMesa).includes(valorBusca) ||
        String(item.status).includes(valorBusca)
      );
    });

    montarMesas(itensFiltrados);
  });
}

// Pega todos os itens do localStorage e retorna
function pegarItensLocalStorage() {
  try {
    const cardapioItensLocalStorage = JSON.parse(localStorage.getItem("mesas"));
    return cardapioItensLocalStorage;
  } catch (error) {}
}

// Adicionar um Evento de clique que monta uma tela de modal para confirmar a edicao e adicionar os novos parametros do item
function adicionarEventoCliqueEditarBotaoItemCardapio(idItem, tituloItem) {
  let botaoDelete = document.querySelector(`#button-li-editar-${tituloItem}`);
  botaoDelete.addEventListener("click", () => {
    montarModalEditarItem(idItem, tituloItem);
  });
}

// Monta o modal na tela de editar um item especifico
async function montarModalEditarItem(idItem, tituloItem) {
  const itemDetalhes = await GETMesa(tituloItem);
  const body = document.body;
  body.insertAdjacentHTML(
    "beforeend",
    `
   <div class="modal-wrapper">
      <div class="modal">
        <div class="modal-header" style="background-color: var(--color-light-blue);">
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
          </svg>
          </svg>
          <h2>Editar Mesa ${tituloItem}</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <p>Numero Mesa:</p>
          <input type="text" class="input-item-modal" value="${itemDetalhes.numeroMesa}"/>
          <p>Situacao Mesa:</p>
          <select id="select-adicionar-mesa">
            <option value="livre">Livre</option>
            <option value="ocupada">Ocupada</option>
          </select>
          <div>
            <button class="button-adicionar-item-modal" id="button-aplicar-alteracoes">✏️ Aplicar Alterações</button>
          </div>
        </div>
      </div>
    </div>
    `
  );

  adicionarEventoCliqueBotaoFecharModal();
  adicionarEventoCliqueBotaoEditarItemModal(itemDetalhes.numeroMesa, idItem);
  adicionarEventoCliqueRemoverModalWrapper();
}

// adiciona Um evento de clique no botao de confirmar a edicao de um item (no modal de editar item)
async function adicionarEventoCliqueBotaoEditarItemModal(numeroMesa, idItem) {
  const botaoDeletarItem = document.querySelector("#button-aplicar-alteracoes");
  botaoDeletarItem.addEventListener("click", async () => {
    const valoresItem = pegarValoresDosItens(numeroMesa);

    if (isNaN(valoresItem[0])) {
      carregarModalErro("Escreva um Numero Mesa");
    } else {
      try {
        await PUTMesa(valoresItem, idItem);
        deletarItensUl();
        montarLiCarregandoUl();
        removerModal();
        carregarModalSucessoAlterado();
        await montarItensLocalStorage();
      } catch (error) {
        console.error("Erro ao atualizar mesa:", error);
        carregarModalErro("Erro ao atualizar mesa");
      }
    }
  });
}

// Adicionar um Evento de clique que monta uma tela de modal para confirmar a deletacao
function adicionarEventoCliqueDeletarBotaoItemCardapio(idMesa, numeroMesa) {
  let botaoDelete = document.querySelector(`#button-li-delete-${numeroMesa}`);
  botaoDelete.addEventListener("click", () => {
    montarModalDeletarMesa(idMesa, numeroMesa);
  });
}

// Monta o modal na tela de deletar um item especifico
function montarModalDeletarMesa(idMesa, numeroMesa) {
  const body = document.body;
  body.insertAdjacentHTML(
    "beforeend",
    `
     <div class="modal-wrapper">
      <div class="modal">
        <div class="modal-header" style="background-color: var(--color-red);">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            fill="currentColor"
            class="bi bi-file-x"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708"
            />
            <path
              d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"
            />
          </svg>
          <h2>Deseja deletar a mesa ${numeroMesa}?</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <div>
            <button class="button-adicionar-item-modal" id="button-deletar-item">
              Sim, delete o item
            </button>
          </div>
        </div>
      </div>
    </div>
    `
  );
  adicionarEventoCliqueBotaoFecharModal();
  adicionarEventoCliqueBotaoConfirmarDeletarItem(numeroMesa, idMesa);
  adicionarEventoCliqueRemoverModalWrapper();
}

// Adiciona um evento de clique no botao de confirmar a delecao de um item (no modal)
async function adicionarEventoCliqueBotaoConfirmarDeletarItem(
  numeroMesa,
  idMesa
) {
  const botaoDeletarItem = document.querySelector("#button-deletar-item");
  botaoDeletarItem.addEventListener("click", async () => {
    await DELETEMesa(idMesa);
    deletarItensUl();
    montarLiCarregandoUl();
    carregarModalSucessoDeletado();
    await montarItensLocalStorage();
    removerModal();
  });
}

// Recarrega a pagina
function recarregarPagina() {
  location.reload();
}

// Monta o toastify de sucesso na tela
function carregarModalErro(mensagem) {
  toastr.error(mensagem);
}
// Monta o toastify de sucesso na tela
function carregarModalSucessoAdicionado() {
  toastr.success("Adicionado com Sucesso");
}

// Monta o toastify de alterado na tela
function carregarModalSucessoAlterado() {
  toastr.success("Alterado com Sucesso");
}

// Monta o toastify de deletar na tela
function carregarModalSucessoDeletado() {
  toastr.success("Deletado com Sucesso");
}

// Adiciona uma Li na tela escrito carregando...
function montarLiCarregandoUl() {
  let ulCardapioItens = document.querySelector("ul");
  ulCardapioItens.innerHTML = "";
  ulCardapioItens.insertAdjacentHTML(
    "beforeend",
    `
      <li>
            <div class="div-li-info">
              <h3>Carregando...</h3>
            </div>

      </li>
      `
  );
}

// Deleta todos os itens da Ul em html (li)
function deletarItensUl() {
  let ulCardapioItens = document.querySelector("ul");
  ulCardapioItens.innerHTML = "";
}

async function montarItensLocalStorage() {
  montarLiCarregandoUl();

  try {
    const mesas = await GETMesas();
    adicionarItensLocalStorage(mesas);
    montarMesas(mesas);
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
    toastr.error("Erro ao carregar mesas");

    // Remove o item de carregamento em caso de erro
    deletarItensUl();
  }
}

// Adiciona o array de items enviado para o LocalStorage
function adicionarItensLocalStorage(mesas) {
  // Mapeia as mesas para adicionar o campo de status baseado no ID
  const mesasComStatus = mesas.map((mesa) => {
    // Cria uma cópia do objeto mesa para não modificar o original
    const mesaAtualizada = { ...mesa };

    // Verifica o ID da mesa e adiciona o campo de status
    if (mesa.situacaoMesa === 1) {
      mesaAtualizada.status = "ocupado";
    } else if (mesa.situacaoMesa === 0) {
      mesaAtualizada.status = "livre";
    }

    return mesaAtualizada;
  });

  // Salva as mesas com o novo campo de status no localStorage
  localStorage.setItem("mesas", JSON.stringify(mesasComStatus));
}
// Adicionar um Evento de clique que monta uma tela de modal para adicionar os parametros para adicionar um novo item e confirmar a adicao
function adicionarEventoCliqueBotaoAdicionarItem() {
  const botaoAdicionarItem = document.querySelector("#button-adicionar-item");
  botaoAdicionarItem.addEventListener("click", () => {
    montarModalAdicionarItem();
  });
}

// Monta o modal na tela de adicionar um item
function montarModalAdicionarItem() {
  const body = document.body;
  body.insertAdjacentHTML(
    "beforeend",
    `
     <div class="modal-wrapper">
      <div class="modal">
        <div class="modal-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            fill="currentColor"
            class="bi bi-clipboard-plus"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"
            />
            <path
              d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
            />
            <path
              d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
            />
          </svg>
          <h2>Adicionar Mesa</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <p>Numero Mesa:</p>
          <input type="number" class="input-item-modal" />
          <p>Situacao Mesa:</p>
          <select id="select-adicionar-mesa">
            <option value="livre">Livre</option>
            <option value="ocupada">Ocupada</option>
          </select>
          <div>
            <button class="button-adicionar-item-modal">+ Adicionar</button>
          </div>
        </div>
      </div>
    </div>
    `
  );

  adicionarEventoCliqueBotaoFecharModal();
  adicionarEventoCliqueBotaoAdicionarItemModal();
  adicionarEventoCliqueRemoverModalWrapper();
}

// Adicionar um evento de clique no botao de fechar o modal(o x no canto superior direito do modal)
function adicionarEventoCliqueBotaoFecharModal() {
  const buttonClose = document.querySelector(".modal-button");
  buttonClose.addEventListener("click", () => {
    removerModal();
  });
}

// Adiciona um evento de clique no modal wrapper para remover si mesmo
function adicionarEventoCliqueRemoverModalWrapper() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
      removerModal();
    }
  });
}

// Adiciona um evento de clique no botao de adicionar algum item no modal
function adicionarEventoCliqueBotaoAdicionarItemModal() {
  const buttonAdicionarItemModal = document.querySelector(
    ".button-adicionar-item-modal"
  );
  buttonAdicionarItemModal.addEventListener("click", () => {
    adicionarItem();
  });
}

// Funcao de adicionar item na API e na tela, pegando as informacoes do modal de adicionar item
async function adicionarItem() {
  const valoresItem = pegarValoresDosItens();

  if (isNaN(valoresItem[0])) {
    carregarModalErro("Escreva um numero mesa");
  } else if (valoresItem[0] < 1) {
    carregarModalErro("Escreva um numero mesa maior que 0.");
  } else {
    try {
      await POSTMesa(valoresItem);
      deletarItensUl();
      // montarMesas();
      removerModal();
      carregarModalSucessoAdicionado();
      montarLiCarregandoUl();
      await montarItensLocalStorage();
    } catch (error) {
      carregarModalErro("Erro ao adicionar mesa");
    }
  }
}

// Pegar os valores do modal de adicionar itens e retorna eles em um array
function pegarValoresDosItens() {
  let valoresArray = [];
  let valoresItens = document.querySelector(".input-item-modal").value;
  let selectValor = document.querySelector("#select-adicionar-mesa").value;
  if (selectValor === "livre") {
    valoresArray.push(parseInt(valoresItens), 0);
  } else {
    valoresArray.push(parseInt(valoresItens), 1);
  }

  return valoresArray;
}

document.addEventListener("DOMContentLoaded", function () {
  const avatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");

  avatar.addEventListener("click", () => {
    logoutBtn.classList.toggle("show");
  });

  logoutBtn.addEventListener("click", () => {
    window.location.href = "../login/index.html"; // Redireciona para a tela de login
  });
});

// Remove o modal por completo da tela
function removerModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.remove();
}

function pegarInfoUsuarioLocalStorage() {
  let usuarioInfo = localStorage.getItem("usuarioInfo");
  usuarioInfo = JSON.parse(usuarioInfo);
  return usuarioInfo;
}

function mudarNomeDoUsuario(usuarioInfo) {
  let usuarioP = document.getElementById("p-username");
  usuarioP.innerHTML = usuarioInfo.username;
}

function chamarPrimeirasFuncoes() {
  let usuarioInfo = pegarInfoUsuarioLocalStorage();
  montarItensLocalStorage();
  filtrarItem();
  if (usuarioInfo.userId === 1) {
    adicionarEventoCliqueBotaoAdicionarItem();
  }
  mudarNomeDoUsuario(usuarioInfo);
}

document.addEventListener("DOMContentLoaded", function () {
  // Verificar se o usuário está logado
  const usuarioInfo = localStorage.getItem("usuarioInfo");

  if (!usuarioInfo) {
    exibirModalLogin();
  }
});

// Função para exibir o modal
function exibirModalLogin() {
  // Inserir o modal no HTML
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    ">
      <div style="
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      ">
        <p style="margin: 0 0 10px;">Você não está logado. Por favor, faça login para acessar o sistema.</p>
        <button id="botao-login" style="
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #007BFF;
          color: white;
          cursor: pointer;
        ">Ir para o Login</button>
      </div>
    </div>
    `
  );

  // Adicionar evento ao botão de login
  const botaoLogin = document.getElementById("botao-login");
  botaoLogin.addEventListener("click", () => {
    window.location.href = "../login/index.html";
  });
}

chamarPrimeirasFuncoes();
