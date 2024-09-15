const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function GETItensCardapio() {
  let response = await fetch("http://localhost:5164/api/CardapioItems", {
    method: "GET",
    headers: header,
  });
  let result = await response.json();
  console.log(result);
  return result;
}

async function montarItensCardapio() {
  const cardapioItens = await GETItensCardapio();
  let ulCardapioItens = document.querySelector("ul");
  cardapioItens.forEach((item) => {
    ulCardapioItens.insertAdjacentHTML(
      "beforeend",
      `
      <li>
            <div class="div-li-info">
              <h3>${item.titulo}</h3>
              <p>${item.descricao}</p>
              <p>R$${item.preco.toFixed(2)}</p>
            </div>
            <div class="div-li-buttons">
              <button id="button-li-delete-${item.id}">❌</button>
              <button>✏️</button>
            </div>
      </li>
      `
    );
    adicionarEventoCliqueDeletarBotaoItemCardapio(item.id, item.titulo);
  });
}

function adicionarEventoCliqueDeletarBotaoItemCardapio(idItem, tituloItem) {
  let botaoDelete = document.querySelector(`#button-li-delete-${idItem}`);
  botaoDelete.addEventListener("click", () => {
    montarModalDeletarItem(idItem, tituloItem);
  });
}

function adicionarEventoCliqueBotaoAdicionarItem() {
  const botaoAdicionarItem = document.querySelector("#button-adicionar-item");
  botaoAdicionarItem.addEventListener("click", () => {
    montarModalAdicionarItem();
  });
}

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
          <h2>Adicionar Item</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <p>Nome Item:</p>
          <input type="text" class="input-item-modal" />
          <p>Descricao Item:</p>
          <input type="text" class="input-item-modal" />
          <p>Preco Item:</p>
          <input type="text" class="input-item-modal" />
          <p>Possui Preparo?</p>
          <input type="checkbox" id="checkbox-adicionar-item"/>
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
}

function montarModalDeletarItem(itemId, itemTitulo) {
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
          <h2>Deseja deletar o item ${itemTitulo}?</h2>
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
  adicionarEventoCliqueBotaoConfirmarDeletarItem(itemId);
}

function adicionarEventoCliqueBotaoConfirmarDeletarItem(itemId) {
  const botaoDeletarItem = document.querySelector("#button-deletar-item");
  botaoDeletarItem.addEventListener("click", () => {
    DELETEItenCardapio(itemId);
  });
}

async function DELETEItenCardapio(itemId) {
  let response = await fetch(
    `http://localhost:5164/api/CardapioItems/${itemId}`,
    {
      method: "DELETE",
      headers: header,
    }
  );
  deletarItensUl();
  montarItensCardapio();
  removerModal();
}

function adicionarEventoCliqueBotaoFecharModal() {
  const buttonClose = document.querySelector(".modal-button");
  buttonClose.addEventListener("click", () => {
    removerModal();
  });
}

function removerModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.remove();
}

function adicionarEventoCliqueBotaoAdicionarItemModal() {
  const buttonAdicionarItemModal = document.querySelector(
    ".button-adicionar-item-modal"
  );
  buttonAdicionarItemModal.addEventListener("click", () => {
    POSTItemCardapio();
  });
}

async function POSTItemCardapio() {
  const valoresItem = pegarValoresDosItens();
  let valoresInputs = valoresItem[0];
  let valorCheckbox = valoresItem[1];

  let response = await fetch("http://localhost:5164/api/CardapioItems", {
    method: "POST",
    headers: header,
    body: JSON.stringify({
      titulo: valoresInputs[0].value,
      descricao: valoresInputs[1].value,
      preco: parseFloat(valoresInputs[2].value),
      possuiPreparo: valorCheckbox.checked,
    }),
  });
  let result = await response.json();
  deletarItensUl();
  montarItensCardapio();
  removerModal();
}

function pegarValoresDosItens() {
  let arrayValores = [];
  let valoresItens = document.querySelectorAll(".input-item-modal");
  let checkbox = document.querySelector("#checkbox-adicionar-item");
  arrayValores.push(valoresItens);
  arrayValores.push(checkbox);

  return arrayValores;
}

function deletarItensUl() {
  let ulCardapioItens = document.querySelector("ul");
  ulCardapioItens.innerHTML = "";
}

adicionarEventoCliqueBotaoAdicionarItem();
montarItensCardapio();
