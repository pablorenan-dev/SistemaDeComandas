const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };


async function GETTodasComandas() {
    let response = await fetch("https://localhost:7168/api/Comandas", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let result = await response.json();
    console.log(result)
    return result;
  }

  GETTodasComandas()
  
  async function montarComandas() {
    const comandas = await GETTodasComandas();
    const ulComandas = document.querySelector("#lista-comandas");
    
    ulComandas.innerHTML = ''; // Limpa a lista antes de inserir os elementos
  
    comandas.forEach((comanda) => {
      const itens = Array.isArray(comanda.comandaItens) 
        ? comanda.comandaItens
        : "Nenhum item listado";
      console.log(itens)
      ulComandas.insertAdjacentHTML(
        "beforeend",
        `
        <li id="comanda-${comanda.id}">
          <h3>Cliente: ${comanda.nomeCliente}</h3>
          <p>Número da mesa: ${comanda.numeroMesa}</p>
          <p>Itens: ${itens.map((item)=>item.titulo)}</p>
          <button class="button-editar" id="${comanda.id}edit">Editar</button>
        </li>
        `
      );
      let btnEditar = document.getElementById(`${comanda.id}edit`)
      btnEditar.addEventListener("click", ()=>{
        abrirModalEdicao(comanda)
      })


    });
  }  
montarComandas();
function criarModalEdicao(comanda) {
    // Verifica se o modal já existe, se não, cria-o
    console.log("começou")
    if (document.querySelector('#modal-editar-comanda')) return;
    console.log("passour")
    const modalHtml = `
      <div id="modal-editar-comanda" class="modal-wrapper" style="display: none;">
        <div class="modal">
          <div class="modal-header">
            <h2>Editar Comanda</h2>
            <button onclick="fecharModal()">X</button>
          </div>
          <div class="modal-body">
            <label for="nome-cliente-editar">Nome do Cliente:</label>
            <input type="text" id="nome-cliente-editar" placeholder="Nome do Cliente">
            
            <label for="mesa-editar">Número da Mesa:</label>
            <input type="text" id="mesa-editar" placeholder="Número da Mesa">
            
            <label for="itens-editar">Itens:</label>
            <textarea  rows="4" placeholder="Exemplo: Café, Bolo"></textarea>
              <select id="itens-editar"></select>
            <button class="button-geral" onclick="salvarEdicaoComanda()">Salvar</button>
          </div>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    console.log("teste")
    // abrirModalEdicao(comanda)
    // let comanda = [];
  }
  
      async function abrirModalEdicao(comanda) {
        // Garante que o modal foi criado
        console.log(comanda,"chega no modal de editar")
        criarModalEdicao();
      
        // Encontra a comanda a ser editada
        // Preenche os campos com os dados atuais da comanda
        
        document.querySelector('#nome-cliente-editar').value = comanda.nomeCliente;
        document.querySelector('#mesa-editar').value = comanda.numeroMesa;
        comanda.comandaItens.forEach((item)=>{
          document.querySelector('#itens-editar').insertAdjacentHTML(`beforeend`,`

              <option value=${item.id}> ${item.titulo}</option>
            `) 
        })
        
        // Exibe o modal
        document.querySelector('#modal-editar-comanda').style.display = 'flex';
        
        // Armazena o ID da comanda sendo editada
        document.querySelector('#modal-editar-comanda').dataset.id = comanda.id;
      }
      
      function fecharModal() {
        document.querySelector('#modal-editar-comanda').style.display = 'none';
      }

    async function salvarEdicaoComanda() {
        const idComanda = document.querySelector('#modal-editar-comanda').dataset.id;
        const nomeCliente = document.querySelector('#nome-cliente-editar').value;
        const numeroMesa = document.querySelector('#mesa-editar').value;
        const itens = document.querySelector('#itens-editar').value.split(",").map(item => item.trim());
      
        const dadosAtualizados = {
          nomeCliente: nomeCliente,
          numeroMesa: numeroMesa,
          cardapioItems: itens
        };
      
        try {
          const response = await fetch(`https://localhost:7168/api/Comandas/${idComanda}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(dadosAtualizados)
          });
      
          if (response.ok) {
            alert("Comanda atualizada com sucesso!");
            fecharModal();
            atualizarInterfaceComanda(idComanda, dadosAtualizados);
          } else {
            alert("Erro ao atualizar comanda.");
          }
        } catch (error) {
          console.error("Erro na requisição:", error);
          alert("Erro ao conectar com o servidor.");
        }
}

function atualizarInterfaceComanda(idComanda, dadosAtualizados) {
    const comandaLi = document.querySelector(`#comanda-${idComanda}`);
    
    comandaLi.querySelector('h3').innerText = `Cliente: ${dadosAtualizados.nomeCliente}`;
    comandaLi.querySelector('p:nth-child(2)').innerText = `Número da mesa: ${dadosAtualizados.numeroMesa}`;
    comandaLi.querySelector('p:nth-child(3)').innerText = `Itens: ${dadosAtualizados.cardapioItems.join(", ")}`;
  }

    
      
  

  
  