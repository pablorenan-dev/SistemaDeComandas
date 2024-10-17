import { GETUsuarios, POSTUsuario, DELETEUsuario } from "./usuarioApiScript.js";

// Adiciona um evento de clique no h1 para retornar para o menu
function adicionarEventoCliqueH1Chiquinho() {
  const h1Chiquinho = document.querySelector(".h1-chiquinho");
  h1Chiquinho.addEventListener("click", () => {
    document.location.href = "http://127.0.0.1:5500/index.html";
  });
}

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
          <h2>Adicionar Item</h2>
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
}

// Adicionar um evento de clique no botao de fechar o modal(o x no canto superior direito do modal)
function adicionarEventoCliqueBotaoFecharModal() {
  const buttonClose = document.querySelector(".modal-button");
  buttonClose.addEventListener("click", () => {
    removerModal();
  });
}

// Funcao de adicionar item na API e na tela, pegando as informacoes do modal de adicionar item
function adicionarUsuario() {
  const valoresUsuario = pegarValoresDosItens();
  try {
    POSTUsuario(valoresUsuario);
    deletarItensUl();
    montarUsuarios();
    removerModal();
    carregarModalSucessoAdicionado();
    montarLiCarregandoUl();
    setTimeout(recarregarPagina, 2000);
  } catch (error) {
    console.log(error);
  }
}

// Monta o toastify de sucesso na tela
function carregarModalErroAdicionado() {
  toastr.success("Erro ao adicionar");
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

  console.log(valoresItens);
  return valoresItens;
}

// Remove o modal por completo da tela
function removerModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.remove();
}

// Adiciona um evento de clique no botao de adicionar algum item no modal
function adicionarEventoCliqueBotaoAdicionarUsuarioModal() {
  const buttonAdicionarItemModal = document.querySelector(
    ".button-adicionar-item-modal"
  );
  buttonAdicionarItemModal.addEventListener("click", () => {
    adicionarUsuario();
  });
}

// Adicionar os itens do Cardapio na tela
async function montarUsuarios(usuarios = []) {
  let ulUsuarios = document.querySelector("ul");
  ulUsuarios.innerHTML = "";
  usuarios.forEach((item) => {
    ulUsuarios.insertAdjacentHTML(
      "beforeend",
      `
      <li>
            <div class="div-li-info">
              <p>👤 ${item.nomeUsuario}</p>
              <p>✉ ${item.emailUsuario}</p>
              <p>🔒 ${item.senhaUsuario}</p>
            </div>
            <div class="div-li-buttons">
              <button id="button-li-delete-${item.idUsuario}">❌</button>
              <button id="button-li-editar-${item.idUsuario}">✏️</button>
            </div>
      </li>
      `
    );
    adicionarEventoCliqueDeletarBotaoUsuario(item.idUsuario, item.nomeUsuario);
    // adicionarEventoCliqueEditarBotaoUsuario(item.id, item.titulo);
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
}

// Adiciona um evento de clique no botao de confirmar a delecao de um item (no modal)
async function adicionarEventoCliqueBotaoConfirmarDeletarItem(idItem) {
  const botaoDeletarItem = document.querySelector("#button-deletar-item");
  botaoDeletarItem.addEventListener("click", async () => {
    DELETEUsuario(idItem);
    deletarItensUl();
    montarLiCarregandoUl();
    carregarModalSucessoDeletado();
    removerModal();
    let novosUsuarios = await GETUsuarios();
    adicionarUsuariosLocalStorage(novosUsuarios);
    setTimeout(recarregarPagina, 2000);
  });
}

// Pega os Itens do LocalStorage e monta eles na tela em hmtl
async function montarUsuariosLocalStorage() {
  const usuarios = await GETUsuarios();
  adicionarUsuariosLocalStorage(usuarios);
  montarUsuarios(usuarios);
}

// Adiciona o array de items enviado para o LocalStorage
function adicionarUsuariosLocalStorage(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Chama todas as funcoes iniciais
function chamarFuncoesIniciais() {
  adicionarEventoCliqueH1Chiquinho();
  adicionarEventoCliqueBotaoAdicionarUsuario();
  montarUsuariosLocalStorage();
}

chamarFuncoesIniciais();