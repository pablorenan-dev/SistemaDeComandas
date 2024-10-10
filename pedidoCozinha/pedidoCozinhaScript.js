const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

async function GETPedidoCozinha(situacaoId,element) {
  //ENDPOINT == ?situacaoId
  // situacaoId = 1 == pendente; situacaoId = 2 == andamento; situacaoId = 3 == finalizado;
  let response = await fetch(`https://localhost:7129/api/PedidoCozinhas?situacaoId=${situacaoId}`, {
    method: "GET",
    headers: header,
  });
  let result = await response.json();
  console.log(result);
  montarPedidoCozinha(result,element,situacaoId);
};
  
function montarPedidoCozinha(pedidos,element,finish) {
  console.log(finish,"finish")
  let ulPedidoCozinhaItens = document.querySelector(element);
  ulPedidoCozinhaItens.innerHTML = ""
  pedidos.forEach((pedido) => {
    ulPedidoCozinhaItens.insertAdjacentHTML(
      "beforeend",
      `
      <li draggable="true" id="mover${pedido.id}">
      <p>${pedido.item}</p>
      </li>
      `
    );

    const columns = document.querySelectorAll(".coluna");
    const mover = document.getElementById(`mover${pedido.id}`)
    
    document.addEventListener("dragstart", (e) => {
      e.target.classList.add("dragging");
    });
    
    columns.forEach((item) => {
      mover.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        console.log(e,"evnto dragover colum")
        PUTPedidoCozinha(pedido.id,finish)
        console.log(item)
      });
    })
  });
};
  
GETPedidoCozinha(1,"#ul-Pendente");
GETPedidoCozinha(2,"#ul-Andamento");
GETPedidoCozinha(3,"#ul-Finalizado");

async function PUTPedidoCozinha(id,situacaoId) {
  
  const body = {
    novoStatusId:situacaoId + 1
  }
  if(body.novoStatusId<=3){

    let response = await fetch(`https://localhost:7129/api/PedidoCozinhas/${id}`, {
      method: "PUT",
      headers: header,
      body:JSON.stringify(body)
    });
  
    if(response.ok){
      GETPedidoCozinha(1,"#ul-Pendente");
      GETPedidoCozinha(2,"#ul-Andamento");
      GETPedidoCozinha(3,"#ul-Finalizado");
    }
  }
  };