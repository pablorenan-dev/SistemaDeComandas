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

montarItensLocalStorage();
adicionarEventoCliqueH1Chiquinho();
