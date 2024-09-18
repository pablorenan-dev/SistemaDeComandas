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
    montarItensCardapio(result);
  }
  
  function montarItensCardapio(cardapioItens) {
    let ulCardapioItens = document.querySelector("#ul-cardapio");
    cardapioItens.forEach((item) => {
      ulCardapioItens.insertAdjacentHTML(
        "beforeend",
        `
        <li>${item.titulo}</li>
        `
      );
    });
  }
  
  GETItensCardapio();