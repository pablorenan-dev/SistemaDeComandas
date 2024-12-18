import {
  GETUsuarios,
  POSTUsuario,
  DELETEUsuario,
  PUTUsuario,
  GETUsuario,
} from "./usuarioApiScript.js";

// Adicionar um Evento de clique que monta uma tela de modal para adicionar os parametros para adicionar um novo item e confirmar a adicao
function adicionarEventoCliqueBotaoAdicionarUsuario() {
  const botaoAdicionarItem = document.querySelector("#button-adicionar-item");
  botaoAdicionarItem.addEventListener("click", () => {
    montarModalAdicionarUsuario();
  });
}

// Monta o modal na tela de adicionar um item
function montarModalAdicionarUsuario() {
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
          <h2>Adicionar novo Usuário</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <p>Nome Usuário:</p>
          <input type="text" class="input-item-modal" />
          <p>Email Usuário:</p>
          <input type="text" class="input-item-modal" />
          <p>Senha Usuário:</p>
          <input type="text" class="input-item-modal" />
          <div>
            <button class="button-adicionar-item-modal">+ Adicionar</button>
          </div>
        </div>
      </div>
    </div>
    `
  );
  adicionarEventoCliqueBotaoFecharModal();
  adicionarEventoCliqueBotaoAdicionarUsuarioModal();
  adicionarEventoCliqueRemoverModalWrapper();
}

function adicionarEventoCliqueRemoverModalWrapper() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
      removerModal();
    }
  });
}

// Adicionar um evento de clique no botao de fechar o modal(o x no canto superior direito do modal)
function adicionarEventoCliqueBotaoFecharModal() {
  const buttonClose = document.querySelector(".modal-button");
  buttonClose.addEventListener("click", () => {
    removerModal();
  });
}

// Funcao de adicionar item na API e na tela, pegando as informacoes do modal de adicionar item
async function adicionarUsuario() {
  const valoresUsuario = pegarValoresDosItens();
  if (valoresUsuario[0].value == "") {
    carregarModalErro("Escreva um nome de usuário valido");
  } else if (valoresUsuario[1].value == "") {
    carregarModalErro("Escreva um email valido");
  } else if (valoresUsuario[2].value == "") {
    carregarModalErro("Escreva uma senha valida");
  } else {
    try {
      // Usa async/await para garantir que o item seja adicionado
      const adicionarUsuarioAsync = async () => {
        await POSTUsuario(valoresUsuario);
        deletarItensUl();
        montarLiCarregandoUl();
        removerModal();
        carregarModalSucessoAdicionado();
        await montarUsuariosLocalStorage();
      };
      adicionarUsuarioAsync();
    } catch (error) {
      carregarModalErro("Erro ao adicionar Usuario");
    }
  }
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

// Recarrega a pagina
function recarregarPagina() {
  location.reload();
}

// Deleta todos os itens da Ul em html (li)
function deletarItensUl() {
  let ulCardapioItens = document.querySelector("ul");
  ulCardapioItens.innerHTML = "";
}

// Pegar os valores do modal de adicionar itens e retorna eles em um array
function pegarValoresDosItens() {
  let valoresItens = document.querySelectorAll(".input-item-modal");
  return valoresItens;
}

// Remove o modal por completo da tela
function removerModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.remove();
}

// Adiciona um evento de clique no botao de adicionar algum item no modal
function adicionarEventoCliqueBotaoAdicionarUsuarioModal() {
  const buttonAdicionarUsuarioModal = document.querySelector(
    ".button-adicionar-item-modal"
  );
  buttonAdicionarUsuarioModal.addEventListener("click", () => {
    adicionarUsuario();
  });
}

// Adicionar os itens do Cardapio na tela
async function montarUsuarios(usuarios = []) {
  let ulUsuarios = document.querySelector("ul");
  ulUsuarios.innerHTML = "";
  usuarios.forEach((item) => {
    if (item.nomeUsuario === "admin") {
      ulUsuarios.insertAdjacentHTML(
        "beforeend",
        `
        <li>
              <div class="div-li-info">
                <p>👤 ${item.nomeUsuario}</p>
                <p>✉ ${item.emailUsuario}</p>
                <p>🔒 ********</p>
              </div>
              <div class="div-li-buttons">
                <button id="button-li-editar-${item.idUsuario}">✏️</button>
              </div>
        </li>
        `
      );
      adicionarEventoCliqueEditarBotaoUsuario(item.idUsuario, item.nomeUsuario);
    } else {
      ulUsuarios.insertAdjacentHTML(
        "beforeend",
        `
        <li>
              <div class="div-li-info">
                <p>👤 ${item.nomeUsuario}</p>
                <p>✉ ${item.emailUsuario}</p>
                <p>🔒 ********</p>
              </div>
              <div class="div-li-buttons">
                <button id="button-li-delete-${item.idUsuario}">❌</button>
                <button id="button-li-editar-${item.idUsuario}">✏️</button>
              </div>
        </li>
        `
      );
      adicionarEventoCliqueDeletarBotaoUsuario(
        item.idUsuario,
        item.nomeUsuario
      );
      adicionarEventoCliqueEditarBotaoUsuario(item.idUsuario, item.nomeUsuario);
    }
  });
}

// Adicionar um Evento de clique que monta uma tela de modal para confirmar a edicao e adicionar os novos parametros do item
function adicionarEventoCliqueEditarBotaoUsuario(idItem, tituloItem) {
  let botaoDelete = document.querySelector(`#button-li-editar-${idItem}`);
  botaoDelete.addEventListener("click", () => {
    montarModalEditarUsuario(idItem, tituloItem);
  });
}

// Monta o modal na tela de editar um item especifico
async function montarModalEditarUsuario(idItem, tituloItem) {
  const itemDetalhes = await GETUsuario(idItem);
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
          <h2>Editar Usuário ${tituloItem}</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <p>Nome:</p>
          <input type="text" class="input-item-modal" value="${
            itemDetalhes.nomeUsuario
          }"/>
          <p>Email:</p>
          <input type="text" class="input-item-modal" value="${
            itemDetalhes.emailUsuario
          }"/>
          <p>Senha:</p>
          <input type="password" class="input-item-modal" value="${
            itemDetalhes.senhaUsuario
          }" ${idItem != 1 ? "disabled" : ""}/>
          <div>
            <button class="button-adicionar-item-modal" id="button-aplicar-alteracoes">✏️ Aplicar Alterações</button>
          </div>
        </div>
      </div>
    </div>
    `
  );

  adicionarEventoCliqueBotaoFecharModal();
  adicionarEventoCliqueBotaoEditarUsuario(idItem);
  adicionarEventoCliqueRemoverModalWrapper();
}

// adiciona Um evento de clique no botao de confirmar a edicao de um item (no modal de editar item)
async function adicionarEventoCliqueBotaoEditarUsuario(idItem) {
  const botaoDeletarItem = document.querySelector("#button-aplicar-alteracoes");
  botaoDeletarItem.addEventListener("click", async () => {
    const valoresItensTela = pegarValoresDosItens();
    if (valoresItensTela[0].value == "") {
      carregarModalErro("Escreva um nome de usuário valido");
    } else if (valoresItensTela[1].value == "") {
      carregarModalErro("Escreva um email valido");
    } else if (valoresItensTela[2].value == "") {
      carregarModalErro("Escreva uma senha valida");
    } else {
      try {
        await PUTUsuario(valoresItensTela, idItem);
        deletarItensUl();
        montarLiCarregandoUl();
        removerModal();
        carregarModalSucessoAlterado();
        await montarUsuariosLocalStorage();
      } catch (error) {
        carregarModalErro("Erro ao montar Usuarios");
      }
    }
  });
}

// Adicionar um Evento de clique que monta uma tela de modal para confirmar a deletacao
function adicionarEventoCliqueDeletarBotaoUsuario(idItem, tituloItem) {
  let botaoDelete = document.querySelector(`#button-li-delete-${idItem}`);
  botaoDelete.addEventListener("click", () => {
    montarModalDeletarUsuario(idItem, tituloItem);
  });
}

// Monta o modal na tela de deletar um item especifico
function montarModalDeletarUsuario(idItem, itemTitulo) {
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
          <h2>Deseja deletar o Usuario ${itemTitulo}?</h2>
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
  adicionarEventoCliqueBotaoConfirmarDeletarItem(idItem);
  adicionarEventoCliqueRemoverModalWrapper();
}

// Adicionar um evento no input de pesquisar, para filtrar os itens na tela, mostrando somente os escritos
function filtrarItem() {
  const inputProcurar = document.querySelector("#input-procurar");

  inputProcurar.addEventListener("input", (event) => {
    const cardapioItensLocalStorage = pegarItensLocalStorage();
    const itensFiltrados = cardapioItensLocalStorage.filter((item) => {
      return (
        item.nomeUsuario
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        item.emailUsuario
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
    });

    montarUsuarios(itensFiltrados);
  });
}

// Pega todos os itens do localStorage e retorna
function pegarItensLocalStorage() {
  try {
    const cardapioItensLocalStorage = JSON.parse(
      localStorage.getItem("usuarios")
    );
    return cardapioItensLocalStorage;
  } catch (error) {}
}

// Adiciona um evento de clique no botao de confirmar a delecao de um item (no modal)
async function adicionarEventoCliqueBotaoConfirmarDeletarItem(idItem) {
  const botaoDeletarItem = document.querySelector("#button-deletar-item");
  botaoDeletarItem.addEventListener("click", async () => {
    try {
      await DELETEUsuario(idItem);
      deletarItensUl();
      montarLiCarregandoUl();
      carregarModalSucessoDeletado();
      await montarUsuariosLocalStorage();
      removerModal();
    } catch (error) {
      carregarModalErro("Erro ao deletar Usuario");
    }
  });
}

// Pega os Itens do LocalStorage e monta eles na tela em hmtl
async function montarUsuariosLocalStorage() {
  montarLiCarregandoUl();

  try {
    const usuarios = await GETUsuarios();
    adicionarUsuariosLocalStorage(usuarios);
    montarUsuarios(usuarios);
  } catch (error) {
    toastr.error("Erro ao carregar Usuarios");
    deletarItensUl();
  }
}

// Adiciona o array de items enviado para o LocalStorage
function adicionarUsuariosLocalStorage(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Chama todas as funcoes iniciais
function chamarFuncoesIniciais() {
  adicionarEventoCliqueBotaoAdicionarUsuario();
  montarUsuariosLocalStorage();
}

document.addEventListener("DOMContentLoaded", function () {
  const avatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");

  avatar.addEventListener("click", () => {
    logoutBtn.classList.toggle("show");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioInfo");
    window.location.href = "../login/index.html"; // Redireciona para a tela de login
  });

  let usuarioInfo = pegarInfoUsuarioLocalStorage();
  mudarNomeDoUsuario(usuarioInfo);
});

function pegarInfoUsuarioLocalStorage() {
  let usuarioInfo = localStorage.getItem("usuarioInfo");
  usuarioInfo = JSON.parse(usuarioInfo);
  return usuarioInfo;
}

function mudarNomeDoUsuario(usuarioInfo) {
  let usuarioP = document.getElementById("p-username");
  usuarioP.innerHTML = usuarioInfo.username;
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

chamarFuncoesIniciais();
filtrarItem();
