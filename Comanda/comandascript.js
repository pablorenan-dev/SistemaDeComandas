const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

let comanda = {};

async function GETItensCardapio() {
  let response = await fetch(
    "https://comandaapilobo.somee.com/api/CardapioItems",
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  return result;
}

async function verificarSituacaoMesa(numeroMesa) {
  try {
    const response = await fetch(
      `https://comandaapilobo.somee.com/api/Mesas/${numeroMesa}`,
      {
        method: "GET",
        headers: header,
      }
    );
    const result = await response.json();
    return result.situacaoMesa; // Deve retornar 0 (disponível) ou 1 (ocupada)
  } catch (error) {
    console.error("Erro ao verificar situação da mesa:", error);
    createModal(
      "Erro",
      "Não foi possível verificar a situação da mesa.",
      icons.error
    );
    return null;
  }
}

async function montarItensCardapio() {
  let ulCardapioItens = document.querySelector("ul");

  // Add a loading state
  ulCardapioItens.innerHTML = `
    <li>
      <div class="div-li-info">
        <h3>Carregando...</h3>
      </div>
    </li>
  `;

  try {
    const cardapioItens = await GETItensCardapio();

    // Clear the loading state and populate with items
    ulCardapioItens.innerHTML = "";

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
            <button id="button-li-add-comanda-${item.id}">➕</button>
          </div>
        </li>
        `
      );
      adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item);
    });

    // Adicionar o botão "Finalizar" ao final da comanda
    adicionarBotaoFinalizarComanda();
  } catch (error) {
    console.error("Erro ao carregar itens do cardápio:", error);
    ulCardapioItens.innerHTML = `
      <li>
        <div class="div-li-info">
          <h3>Erro ao carregar itens</h3>
        </div>
      </li>
    `;
  }
}

function adicionarEventoCliqueAdicionarBotaoItemComanda(idItem, item) {
  const ulComanda = document.querySelector(`#ul-comanda`);
  let botaoAdd = document.querySelector(`#button-li-add-comanda-${idItem}`);

  botaoAdd.addEventListener("click", () => {
    if (comanda[idItem]) {
      comanda[idItem].quantidade += 1;
    } else {
      comanda[idItem] = { ...item, quantidade: 1 };
      ulComanda.insertAdjacentHTML(
        "beforeend",
        `
        <li id="li-comanda-item-${idItem}">
          <div class="div-li-info">
            <h3>${item.titulo}</h3>
            <p>${item.descricao}</p>
            <p>R$${item.preco.toFixed(2)}</p>
            <p>Quantidade: <span id="quantidade-item-${idItem}">1</span></p>
            <p>Valor Total: R$<span id="valor-total-item-${idItem}">${item.preco.toFixed(
          2
        )}</span></p>
          </div>
          <div class="div-li-buttons">
            <button id="button-li-remove-comanda-${idItem}">➖</button>
            <button id="button-li-remove-todos-comanda-${idItem}">❌</button>
          </div>
        </li>
      `
      );
      adicionarEventoCliqueRemoverBotaoItemComanda(idItem);
      adicionarEventoCliqueRemoverTodosBotaoItemComanda(idItem);
    }
    atualizarQuantidadeEValorTotal(idItem);
    atualizarValorTotalComanda();
  });
}
document
  .querySelector("#input-procurar")
  .addEventListener("input", filtrarItensCardapio);

function filtrarItensCardapio() {
  const termoDeBusca = document
    .querySelector("#input-procurar")
    .value.toLowerCase();
  const listaDeItens = document.querySelectorAll("ul li");

  listaDeItens.forEach((li) => {
    const titulo = li.querySelector("h3").textContent.toLowerCase();
    const descricao = li.querySelector("p").textContent.toLowerCase();

    if (titulo.includes(termoDeBusca) || descricao.includes(termoDeBusca)) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
}

// Função para remover um item específico da comanda
function adicionarEventoCliqueRemoverBotaoItemComanda(idItem) {
  let botaoRemove = document.querySelector(
    `#button-li-remove-comanda-${idItem}`
  );
  botaoRemove.addEventListener("click", () => {
    if (comanda[idItem]) {
      // Diminui a quantidade ou remove o item se a quantidade chegar a zero
      comanda[idItem].quantidade -= 1;
      if (comanda[idItem].quantidade === 0) {
        delete comanda[idItem];
        let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
        if (itemLi) {
          itemLi.remove();
        }
      } else {
        atualizarQuantidadeEValorTotal(idItem);
      }

      // Atualiza o valor total da comanda após a remoção
      atualizarValorTotalComanda();
    }
  });
}

function adicionarEventoCliqueRemoverTodosBotaoItemComanda(idItem) {
  let botaoRemoveTodos = document.querySelector(
    `#button-li-remove-todos-comanda-${idItem}`
  );
  botaoRemoveTodos.addEventListener("click", () => {
    if (comanda[idItem]) {
      // Remove o item da comanda
      delete comanda[idItem];

      // Remove o elemento do DOM
      let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
      if (itemLi) {
        itemLi.remove();
      }

      // Atualiza o valor total da comanda após a remoção
      atualizarValorTotalComanda();
    }
  });
}

// Função para atualizar a quantidade e o valor total do item no DOM
function atualizarQuantidadeEValorTotal(idItem) {
  if (comanda[idItem]) {
    document.querySelector(`#quantidade-item-${idItem}`).innerText =
      comanda[idItem].quantidade;
    let valorTotal = comanda[idItem].quantidade * comanda[idItem].preco;
    document.querySelector(`#valor-total-item-${idItem}`).innerText =
      valorTotal.toFixed(2);
  }
}

// Adicionar botão "Finalizar" no footer da comanda
function adicionarBotaoFinalizarComanda() {
  const footerComanda = document.querySelector(`#footer-comanda`);

  footerComanda.innerHTML = `
    <button id="button-finalizar-comanda">✔</button>
  `;

  document
    .querySelector(`#button-finalizar-comanda`)
    .addEventListener("click", finalizarComanda);
}

async function finalizarComanda() {
  const nomeCliente = document.querySelector(
    'input[placeholder="Nome cliente"]'
  ).value;
  const numeroMesa = document.querySelector("#select-mesa").value;

  if (!nomeCliente) {
    createModal(
      "Campo Obrigatório",
      "Por favor, preencha o nome do cliente.",
      icons.error
    );
    return;
  }

  if (!numeroMesa) {
    createModal(
      "Campo Obrigatório",
      "Por favor, preencha o número da mesa.",
      icons.error
    );
    return;
  }

  // Verifica a situação da mesa antes de criar a comanda
  const situacaoMesa = await verificarSituacaoMesa(numeroMesa);

  if (situacaoMesa === 1) {
    createModal(
      "Mesa Ocupada",
      "A mesa já está ocupada. Por favor, escolha outra mesa.",
      icons.error
    );
    return;
  }

  if (situacaoMesa === 0) {
    const itensIDs = Object.keys(comanda);

    try {
      const response = await fetch(
        "https://comandaapilobo.somee.com/api/Comandas",
        {
          method: "POST",
          headers: header,
          body: JSON.stringify({
            numeroMesa: numeroMesa,
            nomeCliente: nomeCliente,
            cardapioItems: itensIDs,
          }),
        }
      );

      createModal("Sucesso", "Comanda finalizada com sucesso!", icons.success);

      document.querySelector("#ul-comanda").innerHTML = "";
      comanda = {};
    } catch (error) {
      console.error("Erro ao finalizar comanda:", error);
      createModal("Erro", "Erro ao finalizar comanda", icons.error);
    }
  }
}

montarItensCardapio();

// Função para calcular o valor total da comanda
function calcularValorTotalComanda() {
  let valorTotal = 0;
  Object.keys(comanda).forEach((idItem) => {
    valorTotal += comanda[idItem].quantidade * comanda[idItem].preco;
  });
  return valorTotal.toFixed(2);
}

// Função para atualizar o valor total da comanda no DOM
function atualizarValorTotalComanda() {
  const totalElement = document.querySelector("#valor-total-comanda");
  if (totalElement) {
    totalElement.innerText = `Valor Total: R$${calcularValorTotalComanda()}`;
  }
}
// Adicione o valor total no rodapé ao lado do botão "Finalizar"
function adicionarBotaoFinalizarComanda() {
  const footerComanda = document.querySelector(`#footer-comanda`);

  footerComanda.innerHTML = `
    <span id="valor-total-comanda">Valor Total: R$0.00</span>
    <button id="button-finalizar-comanda">✔</button>
  `;

  document
    .querySelector(`#button-finalizar-comanda`)
    .addEventListener("click", finalizarComanda);
}

document.querySelector("#ver-comandas").addEventListener("click", () => {
  // Redireciona o usuário para a página de visualização de comandas
  window.location.href = "./verComandas/index.html";
});

function createModal(title, message, icon) {
  const modalHTML = `
    <div class="modal-wrapper">
      <div class="modal">
        <div class="modal-header" style="background-color: var(--color-light-blue);">
          ${icon}
          <h2>${title}</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <p>${message}</p>
          <div>
            <button class="button-confirm-modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Add event listeners for closing the modal
  const closeButton = modalContainer.querySelector(".modal-button");
  const confirmButton = modalContainer.querySelector(".button-confirm-modal");
  const closeModal = () => {
    modalContainer.remove();
    location.reload();
  };

  closeButton.addEventListener("click", closeModal);
  confirmButton.addEventListener("click", closeModal);
}

// Define icons for different types of messages
const icons = {
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
  </svg>`,
};

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
});

async function GETMesas() {
  try {
    const response = await fetch("https://comandaapilobo.somee.com/api/Mesas", {
      method: "GET",
      headers: header,
    });
    const mesas = await response.json();
    return mesas;
  } catch (error) {
    console.error("Erro ao obter as mesas:", error);
    createModal("Erro", "Não foi possível carregar as mesas.", icons.error);
    return [];
  }
}

// Função para carregar mesas disponíveis no select
async function carregarMesasDisponiveis() {
  const mesas = await GETMesas();
  const selectMesa = document.querySelector("#select-mesa");

  // Limpa o select e adiciona a opção inicial
  selectMesa.innerHTML = "<option value=''>Selecione uma Mesa</option>";

  // Adiciona as mesas disponíveis no select
  mesas.forEach((mesa) => {
    if (mesa.situacaoMesa === 0) {
      // Verifica se a mesa está disponível
      selectMesa.insertAdjacentHTML(
        "beforeend",
        `<option value="${mesa.numeroMesa}">Mesa ${mesa.numeroMesa}</option>`
      );
    }
  });
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

document.addEventListener("DOMContentLoaded", () => {
  carregarMesasDisponiveis(); // Carregar mesas disponíveis assim que a página for carregada
  let userInfo = pegarInfoUsuarioLocalStorage();
  mudarNomeDoUsuario(userInfo);
});

document.addEventListener("DOMContentLoaded", function () {
  // Verificar se o usuário está logado
  const usuarioInfo = localStorage.getItem("usuarioInfo");

  if (!usuarioInfo) {
    exibirModalLogin();
  } else {
    chamarPrimeirasFuncoes();
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

document.addEventListener("DOMContentLoaded", function () {
  // Verificar se o usuário está logado
  const usuarioInfo = localStorage.getItem("usuarioInfo");

  if (!usuarioInfo) {
    exibirModalLogin();
  } else {
    chamarPrimeirasFuncoes();
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
