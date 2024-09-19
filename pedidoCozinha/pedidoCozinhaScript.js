const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  async function GETItensCardapio() {
    let response = await fetch("https://localhost:7129/api/CardapioItems", {
      method: "GET",
      headers: header,
    });
    let result = await response.json();
    console.log(result);
    montarPedidoCozinha(result);
  }
  
  function montarPedidoCozinha(cardapioItens) {
    let ulPedidoCozinhaItensAFazer = document.querySelector("#ulPendente");
    cardapioItens.forEach((item) => {
        ulPedidoCozinhaItensAFazer.insertAdjacentHTML(
        "beforeend",
        `
        <li>${item.titulo}</li>
        `
      );
    });
  }
  GETItensCardapio();

  // function adicionarEventoCliqueMoverItemAndamento(item.id)
  // {
  //   montarPedidoCozinha(result);
  // }