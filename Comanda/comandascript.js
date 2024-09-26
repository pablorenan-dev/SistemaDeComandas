const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function GETItensCardapio() {
  let response = await fetch("https://localhost:7168/api/CardapioItems", {
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
          <button id="button-li-add-comanda-${item.id}">👍</button>
        </div>
      </li>
      `
    );
    adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item.titulo, item);
  });
}

function adicionarEventoCliqueAdicionarBotaoItemComanda(idItem, tituloItem, item) {
  const ulComanda = document.querySelector(`#ul-comanda`);
  let botaoAdd = document.querySelector(`#button-li-add-comanda-${idItem}`);
  botaoAdd.addEventListener("click", () => {
    // Adiciona o item na comanda
    ulComanda.insertAdjacentHTML("beforeend",
      `
      <li id="li-comanda-item-${idItem}">
        <div class="div-li-info">
          <h3>${item.titulo}</h3>
          <p>${item.descricao}</p>
          <p>R$${item.preco.toFixed(2)}</p>
        </div>
        <div class="div-li-buttons">
          <button id="button-li-remove-comanda-${idItem}">👎</button>
        </div>
      </li>
      `
    );
    
    // Chama a função para adicionar evento ao botão de remover
    adicionarEventoCliqueRemoverBotaoItemComanda(idItem);
  });
}

function adicionarEventoCliqueRemoverBotaoItemComanda(idItem) {
  // Certifique-se de que o botão está sendo selecionado corretamente após a inserção
  let botaoRemove = document.querySelector(`#button-li-remove-comanda-${idItem}`);
  botaoRemove.addEventListener("click", () => {
    // Remove o item correspondente na comanda
    let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
    if (itemLi) {
      itemLi.remove();
    }
  });
}

montarItensCardapio();
