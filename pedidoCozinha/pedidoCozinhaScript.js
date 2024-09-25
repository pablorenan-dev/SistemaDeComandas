const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  async function GETPedidoCozinha() {
    let response = await fetch("https://localhost:7129/api/CardapioItems", {
      method: "GET",
      headers: header,
    });
    let result = await response.json();
    console.log(result);
    montarPedidoCozinha(result);
    // adicionarEventoCliqueMoverItemAndamento();
  }
  
  function montarPedidoCozinha(cardapioItens) {
    let ulPedidoCozinhaItensAFazer = document.querySelector("#ul-Pendente");
    cardapioItens.forEach((item) => {
        ulPedidoCozinhaItensAFazer.insertAdjacentHTML(
        "beforeend",
        `
        <li>
        <p>${item.titulo}</p>
        <button>→</button>
        </li>
        `
      );
    });
  }
  GETPedidoCozinha();

// function adicionarEventoCliqueMoverItemAndamento(cardapioItens)
// {
//   const btnMoverItemAndamento = document.querySelector("#mover-andamento");
//   btnMoverItemAndamento.addEventListener("click", () => {
//     // mandar pra api a atuliazação do status do item q tu clicou \\
//     // monta a lista novamente \\
//   });
// }