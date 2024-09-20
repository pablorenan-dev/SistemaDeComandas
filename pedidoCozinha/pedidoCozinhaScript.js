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
    adicionarEventoCliqueMoverItemAndamento();
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

function adicionarEventoCliqueMoverItemAndamento(cardapioItens)
{
  const btnMoverItemAndamento = document.querySelector("#mover-andamento");
  btnMoverItemAndamento.addEventListener("click", () => {
    cardapioItens.splice;
    // mandar pra api a atuliazação do status do item q tu clicou
    // monta a lista novamente
  });
}