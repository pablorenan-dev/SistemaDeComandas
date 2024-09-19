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
    adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item.titulo,item);
  });
}

function adicionarEventoCliqueAdicionarBotaoItemComanda(idItem, tituloItem, item) {
  const ulComanda = document.querySelector(`#ul-comanda`);
  let botaoAdd = document.querySelector(`#button-li-add-comanda-${idItem}`);
  botaoAdd.addEventListener("click", () => {
    ulComanda.insertAdjacentHTML("beforeend",
      `
      <li>
            <div class="div-li-info">
              <h3>${item.titulo}</h3>
              <p>${item.descricao}</p>
              <p>R$${item.preco.toFixed(2)}</p>
            </div>
            <div class="div-li-buttons">
              <button id="button-li-remove-comanda-${item.id}">👎</button>
            </div>
      </li>
      `)
    montarModalAdicionarItem(idItem, tituloItem);
  });
}
montarItensCardapio();