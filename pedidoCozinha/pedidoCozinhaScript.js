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
      <li>
      <p>${pedido.item}</p>
      
      ${ finish !=3 ? `<button id=${`btn-mover${pedido.id}`}>→</button>` : ''}
      
      </li>
      `
    );
    const btnMover = document.getElementById(`btn-mover${pedido.id}`)
   
    if(btnMover){
      btnMover.addEventListener("click",()=>PUTPedidoCozinha(pedido.id,finish))
    }
  });
};
  
GETPedidoCozinha(1,"#ul-Pendente");
GETPedidoCozinha(2,"#ul-Andamento");
GETPedidoCozinha(3,"#ul-Finalizado");

async function PUTPedidoCozinha(id,situacaoId) {
  
  const body = {
    novoStatusId:situacaoId+1
  }
  let response = await fetch(`https://localhost:7129/api/PedidoCozinhas/${id}`, {
    method: "PUT",
    headers: header,
    body:JSON.stringify(body)
  });

  // let result = await response.json();
  console.log(response);
  if(response.ok){
    GETPedidoCozinha(1,"#ul-Pendente");
    GETPedidoCozinha(2,"#ul-Andamento");
    GETPedidoCozinha(3,"#ul-Finalizado");
  }
  };


function adicionarEventoCliqueMoverItemAndamento(id)
{
  const btnMoverItemAndamento = document.getElementById("#mover-andamento");
  btnMoverItemAndamento.addEventListener("click", () => {

  });
}

PUTPedidoCozinha(2);
PUTPedidoCozinha(3);