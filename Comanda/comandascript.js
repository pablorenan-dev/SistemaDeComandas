const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

let comanda = {};

async function GETItensCardapio() {
  let response = await fetch("http://localhost:5164/api/CardapioItems", {
    method: "GET",
    headers: header,
  });
  let result = await response.json();
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
          <button id="button-li-add-comanda-${item.id}">➕</button>
        </div>
      </li>
      `
    );
    adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item);
  });

  // Adicionar o botão "Finalizar" ao final da comanda
  adicionarBotaoFinalizarComanda();
}

function adicionarEventoCliqueAdicionarBotaoItemComanda(idItem, item) {
  const ulComanda = document.querySelector(`#ul-comanda`);
  let botaoAdd = document.querySelector(`#button-li-add-comanda-${idItem}`);

  botaoAdd.addEventListener("click", () => {
    // Se o item já estiver na comanda, incrementa a quantidade, caso contrário, adiciona
    if (comanda[idItem]) {
      comanda[idItem].quantidade += 1;
    } else {
      comanda[idItem] = { ...item, quantidade: 1 };
      // Adiciona o item ao DOM
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
      // Chama a função para adicionar eventos aos botões de remover
      adicionarEventoCliqueRemoverBotaoItemComanda(idItem);
      adicionarEventoCliqueRemoverTodosBotaoItemComanda(idItem);
    }
    // Atualiza a quantidade e o valor total no DOM
    atualizarQuantidadeEValorTotal(idItem);
  });
}

function adicionarEventoCliqueRemoverBotaoItemComanda(idItem) {
  let botaoRemove = document.querySelector(
    `#button-li-remove-comanda-${idItem}`
  );
  botaoRemove.addEventListener("click", () => {
    if (comanda[idItem]) {
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
    }
  });
}

function adicionarEventoCliqueRemoverTodosBotaoItemComanda(idItem) {
  let botaoRemoveTodos = document.querySelector(
    `#button-li-remove-todos-comanda-${idItem}`
  );
  botaoRemoveTodos.addEventListener("click", () => {
    if (comanda[idItem]) {
      delete comanda[idItem];
      let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
      if (itemLi) {
        itemLi.remove();
      }
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
  const numeroMesa = document.querySelector(
    'input[placeholder="N° Mesa"]'
  ).value;

  if (!nomeCliente) {
    alert("Por favor, preencha o nome do cliente.");
    return;
  }

  if (!numeroMesa) {
    alert("Por favor, preencha o número da mesa.");
    return;
  }

  // Pegar os IDs dos itens da comanda
  const itensIDs = Object.keys(comanda);

  try {
    // Faz o POST com o nome do cliente, número da mesa e os IDs dos itens
    const response = await fetch("http://localhost:5164/api/Comandas", {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        numeroMesa: numeroMesa,
        nomeCliente: nomeCliente,
        cardapioItems: itensIDs, // Enviando o array de IDs dos itens
      }),
    });

    alert("Comanda finalizada com sucesso!");
    // Limpa a comanda após finalizar
    document.querySelector("#ul-comanda").innerHTML = "";
    comanda = {};
  } catch (error) {
    console.log(error);
    alert("Erro ao finalizar comanda");
  }
}

montarItensCardapio();
