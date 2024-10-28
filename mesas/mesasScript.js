import { GETMesas } from "./mesasApiScript.js";

async function M() {
  let mesas = await GETMesas();
  console.log(mesas);
}

M();

// Adicionar os itens do Cardapio na tela
async function montarItensCardapio(mesas = []) {
  let ulMesas = document.querySelector("ul");
  ulMesas.innerHTML = "";
  mesas.forEach((item) => {
    ulMesas.insertAdjacentHTML(
      "beforeend",
      `
       <li>
            <img src="../imgs/mesa-redonda.png" />
            <p>Mesa ${item.numeroMesa}</p>
            <div>
              <button>
                ❌
              </button>
              <button>
                ✏️
              </button>
            </div>
          </li>
        `
    );
  });
}

async function montarItensLocalStorage() {
  const mesas = await GETMesas();
  adicionarItensLocalStorage(mesas);
  montarItensCardapio(mesas);
}

// Adiciona o array de items enviado para o LocalStorage
function adicionarItensLocalStorage(mesas) {
  localStorage.setItem("mesas", JSON.stringify(mesas));
}

// Adiciona um evento de clique no h1 para retornar para o menu
function adicionarEventoCliqueH1Chiquinho() {
  const h1Chiquinho = document.querySelector(".h1-chiquinho");
  h1Chiquinho.addEventListener("click", () => {
    document.location.href = "http://127.0.0.1:5500/index.html";
  });
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
          <input type="number" class="input-item-modal" />
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
    // adicionarItem();
    console.log("teste");
  });
}

// Remove o modal por completo da tela
function removerModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.remove();
}

montarItensLocalStorage();
adicionarEventoCliqueH1Chiquinho();
adicionarEventoCliqueBotaoAdicionarItem();
