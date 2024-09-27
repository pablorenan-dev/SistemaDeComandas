const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  async function GETPedidoCozinha() {
    let response = await fetch("https://localhost:7129/api/PedidoCozinhas", {
      method: "GET",
      headers: header,
    });
    let result = await response.json();
    console.log(result);
    montarPedidoCozinhaPendentes(result);
    // adicionarEventoCliqueMoverItemAndamento();
  };
  
  function montarPedidoCozinhaPendentes(pedidosPendentes) {
    let ulPedidoCozinhaItensAFazer = document.querySelector("#ul-Pendente");
    pedidosPendentes.forEach((pedido) => {
        ulPedidoCozinhaItensAFazer.insertAdjacentHTML(
        "beforeend",
        `
        <li>
        <p>${pedido.item}</p>
        <button>→</button>
        </li>
        `
      );
    });
  };
  
  GETPedidoCozinha();

// function adicionarEventoCliqueMoverItemAndamento(cardapioItens)
// {
//   const btnMoverItemAndamento = document.querySelector("#mover-andamento");
//   btnMoverItemAndamento.addEventListener("click", () => {
//     // mandar pra api a atuliazação do status do item q tu clicou \\
//     // monta a lista novamente \\
//   });
// }