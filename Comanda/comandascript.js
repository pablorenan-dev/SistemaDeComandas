// const header = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };

// async function GETItensCardapio() {
//   let response = await fetch("https://localhost:7168/api/CardapioItems", {
//     method: "GET",
//     headers: header,
//   });
//   let result = await response.json();
//   console.log(result);
//   return result;
// }

// async function montarItensCardapio() {
//   const cardapioItens = await GETItensCardapio();
//   let ulCardapioItens = document.querySelector("ul");
//   cardapioItens.forEach((item) => {
//     ulCardapioItens.insertAdjacentHTML(
//       "beforeend",
//       `
//       <li>
//         <div class="div-li-info">
//           <h3>${item.titulo}</h3>
//           <p>${item.descricao}</p>
//           <p>R$${item.preco.toFixed(2)}</p>
//         </div>
//         <div class="div-li-buttons">
//           <button id="button-li-add-comanda-${item.id}">👍</button>
//         </div>
//       </li>
//       `
//     );
//     adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item.titulo, item);
//   });
// }

// function adicionarEventoCliqueAdicionarBotaoItemComanda(idItem, tituloItem, item) {
//   const ulComanda = document.querySelector(`#ul-comanda`);
//   let botaoAdd = document.querySelector(`#button-li-add-comanda-${idItem}`);
//   botaoAdd.addEventListener("click", () => {
//     // Adiciona o item na comanda
//     ulComanda.insertAdjacentHTML("beforeend",
//       `
//       <li id="li-comanda-item-${idItem}">
//         <div class="div-li-info">
//           <h3>${item.titulo}</h3>
//           <p>${item.descricao}</p>
//           <p>R$${item.preco.toFixed(2)}</p>
//         </div>
//         <div class="div-li-buttons">
//           <button id="button-li-remove-comanda-${idItem}">👎</button>
//         </div>
//       </li>
//       `
//     );
    
//     // Chama a função para adicionar evento ao botão de remover
//     adicionarEventoCliqueRemoverBotaoItemComanda(idItem);
//   });
// }

// function adicionarEventoCliqueRemoverBotaoItemComanda(idItem) {
//   // Certifique-se de que o botão está sendo selecionado corretamente após a inserção
//   let botaoRemove = document.querySelector(`#button-li-remove-comanda-${idItem}`);
//   botaoRemove.addEventListener("click", () => {
//     // Remove o item correspondente na comanda
//     let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
//     if (itemLi) {
//       itemLi.remove();
//     }
//   });
// }

// montarItensCardapio();





// const header = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };

// // Objeto para armazenar os itens da comanda e suas quantidades
// let comanda = {};

// async function GETItensCardapio() {
//   let response = await fetch("https://localhost:7168/api/CardapioItems", {
//     method: "GET",
//     headers: header,
//   });
//   let result = await response.json();
//   console.log(result);
//   return result;
// }

// async function montarItensCardapio() {
//   const cardapioItens = await GETItensCardapio();
//   let ulCardapioItens = document.querySelector("ul");
//   cardapioItens.forEach((item) => {
//     ulCardapioItens.insertAdjacentHTML(
//       "beforeend",
//       `
//       <li>
//         <div class="div-li-info">
//           <h3>${item.titulo}</h3>
//           <p>${item.descricao}</p>
//           <p>R$${item.preco.toFixed(2)}</p>
//         </div>
//         <div class="div-li-buttons">
//           <button id="button-li-add-comanda-${item.id}">👍</button>
//         </div>
//       </li>
//       `
//     );
//     adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item);
//   });
// }

// function adicionarEventoCliqueAdicionarBotaoItemComanda(idItem, item) {
//   const ulComanda = document.querySelector(`#ul-comanda`);
//   let botaoAdd = document.querySelector(`#button-li-add-comanda-${idItem}`);

//   botaoAdd.addEventListener("click", () => {
//     // Se o item já estiver na comanda, incrementa a quantidade, caso contrário, adiciona
//     if (comanda[idItem]) {
//       comanda[idItem].quantidade += 1;
//     } else {
//       comanda[idItem] = { ...item, quantidade: 1 };
//       // Adiciona o item ao DOM
//       ulComanda.insertAdjacentHTML("beforeend",
//         `
//         <li id="li-comanda-item-${idItem}">
//           <div class="div-li-info">
//             <h3>${item.titulo}</h3>
//             <p>${item.descricao}</p>
//             <p>R$${item.preco.toFixed(2)}</p>
//             <p>Quantidade: <span id="quantidade-item-${idItem}">1</span></p>
//           </div>
//           <div class="div-li-buttons">
//             <button id="button-li-remove-comanda-${idItem}">👎</button>
//           </div>
//         </li>
//         `
//       );
//       // Chama a função para adicionar evento ao botão de remover
//       adicionarEventoCliqueRemoverBotaoItemComanda(idItem);
//     }
//     // Atualiza a quantidade no DOM
//     document.querySelector(`#quantidade-item-${idItem}`).innerText = comanda[idItem].quantidade;
//   });
// }

// function adicionarEventoCliqueRemoverBotaoItemComanda(idItem) {
//   // Certifique-se de que o botão está sendo selecionado corretamente após a inserção
//   let botaoRemove = document.querySelector(`#button-li-remove-comanda-${idItem}`);
//   botaoRemove.addEventListener("click", () => {
//     // Decrementa a quantidade do item na comanda
//     if (comanda[idItem]) {
//       comanda[idItem].quantidade -= 1;

//       // Se a quantidade for 0, remove o item da comanda e do DOM
//       if (comanda[idItem].quantidade === 0) {
//         delete comanda[idItem];
//         let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
//         if (itemLi) {
//           itemLi.remove();
//         }
//       } else {
//         // Atualiza a quantidade no DOM
//         document.querySelector(`#quantidade-item-${idItem}`).innerText = comanda[idItem].quantidade;
//       }
//     }
//   });
// }

// montarItensCardapio();







const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Objeto para armazenar os itens da comanda e suas quantidades
let comanda = {};

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
    adicionarEventoCliqueAdicionarBotaoItemComanda(item.id, item);
  });
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
      ulComanda.insertAdjacentHTML("beforeend",
        `
        <li id="li-comanda-item-${idItem}">
          <div class="div-li-info">
            <h3>${item.titulo}</h3>
            <p>${item.descricao} - R$${item.preco.toFixed(2)}</p>
            <p>Qntd: <span id="quantidade-item-${idItem}">1</span></p>
            <p>Valor Total: R$<span id="valor-total-item-${idItem}">${(item.preco).toFixed(2)}</span></p>
          </div>
          <div class="div-li-buttons">
            <button id="button-li-remove-comanda-${idItem}">⬇</button>
            <button id="button-li-remove-todos-comanda-${idItem}">🗑</button>
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
  // Certifique-se de que o botão está sendo selecionado corretamente após a inserção
  let botaoRemove = document.querySelector(`#button-li-remove-comanda-${idItem}`);
  botaoRemove.addEventListener("click", () => {
    // Decrementa a quantidade do item na comanda
    if (comanda[idItem]) {
      comanda[idItem].quantidade -= 1;

      // Se a quantidade for 0, remove o item da comanda e do DOM
      if (comanda[idItem].quantidade === 0) {
        delete comanda[idItem];
        let itemLi = document.querySelector(`#li-comanda-item-${idItem}`);
        if (itemLi) {
          itemLi.remove();
        }
      } else {
        // Atualiza a quantidade e o valor total no DOM
        atualizarQuantidadeEValorTotal(idItem);
      }
    }
  });
}

function adicionarEventoCliqueRemoverTodosBotaoItemComanda(idItem) {
  let botaoRemoveTodos = document.querySelector(`#button-li-remove-todos-comanda-${idItem}`);
  botaoRemoveTodos.addEventListener("click", () => {
    // Remove o item completamente da comanda
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
    // Atualiza a quantidade
    document.querySelector(`#quantidade-item-${idItem}`).innerText = comanda[idItem].quantidade;
    
    // Calcula e atualiza o valor total
    let valorTotal = comanda[idItem].quantidade * comanda[idItem].preco;
    document.querySelector(`#valor-total-item-${idItem}`).innerText = valorTotal.toFixed(2);
  }
}

montarItensCardapio();
