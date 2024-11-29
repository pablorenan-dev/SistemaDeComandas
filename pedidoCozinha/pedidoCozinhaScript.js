/////////////////////////////////////// Define os cabeçalhos padrão para as requisições HTTP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Busca os pedidos da cozinha baseado no status (situação) e atualiza a interface
 * @param {number} situacaoId - ID do status do pedido (1: pendente, 2: em andamento, 3: finalizado)
 * @param {string} element - Seletor CSS do elemento onde os pedidos serão exibidos
 */
async function GETPedidoCozinha(situacaoId, element, initial = false) {
  let response = await fetch(
    `https://comandaapilobo.somee.com/api/PedidoCozinhas?situacaoId=${situacaoId}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  console.log(result);
  if (initial) {
    localStorage.setItem("pedidos", JSON.stringify(result));
  }
  montarPedidoCozinha(result, element, situacaoId);
  verificarNovosPedidos(result);
  return;
}

// Carrega todos os pedidos quando a tela é aberta \\
GETPedidoCozinha(1, "#ul-Pendente", true);
GETPedidoCozinha(2, "#ul-Andamento");
GETPedidoCozinha(3, "#ul-Finalizado");

/**
 * Atualiza o status de um pedido específico na cozinha
 * @param {number} id - ID do pedido a ser atualizado
 * @param {number} situacaoId - Novo status do pedido (1: pendente, 2: em andamento, 3: finalizado)
 */
async function PUTPedidoCozinha(id, situacaoId) {
  const body = {
    novoStatusId: situacaoId,
  };

  // Verifica se o novo status é válido (menor ou igual a 3) \\
  if (body.novoStatusId <= 3) {
    let response = await fetch(
      `https://comandaapilobo.somee.com/api/PedidoCozinhas/${id}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(body),
      }
    );

    // Se a atualização for bem-sucedida, atualiza todas as listas de pedidos \\
    if (response.ok) {
      await GETPedidoCozinha(1, "#ul-Pendente");
      await GETPedidoCozinha(2, "#ul-Andamento");
      await GETPedidoCozinha(3, "#ul-Finalizado");
    }
  }
}

////////////////////////////////////////////////// aqui começa a montagem da tela \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * Função que modifica o montarPedidoCozinha para adicionar eventos de clique
 * e exibir o modal com os detalhes do pedido
 * @param {Array} pedidos - Array de pedidos a serem exibidos
 * @param {string} element - Seletor CSS do elemento onde os pedidos serão exibidos
 * @param {number} situacaoId - Status atual dos pedidos sendo montados
 */
function montarPedidoCozinha(pedidos, element, situacaoId) {
  let ulPedidoCozinhaItens = document.querySelector(element);
  ulPedidoCozinhaItens.innerHTML = "";

  // Itera sobre cada pedido e cria os elementos na interface
  pedidos.forEach((pedido) => {
    const pedidoHTML = `
      <li draggable="true" id="mover${pedido.id}" class="pedido-item">
        <p>Mesa: ${pedido.numeroMesa} | ${pedido.titulo}</p>
      </li>
    `;

    ulPedidoCozinhaItens.insertAdjacentHTML("beforeend", pedidoHTML);

    // Configura o evento de clique para abrir o modal
    const pedidoElement = document.getElementById(`mover${pedido.id}`);
    pedidoElement.addEventListener("click", () => {
      exibirDetalhesModal(pedido);
    });

    // Configura o sistema de drag and drop \\
    const colunas = document.querySelectorAll(".coluna");
    const mover = document.getElementById(`mover${pedido.id}`);

    // Adiciona classe visual durante o arrasto \\
    document.addEventListener("dragstart", (e) => {
      e.target.classList.add("dragging");
    });

    // Configura o evento de soltar o item para cada coluna
    colunas.forEach((item) => {
      mover.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging"); // Remove a marcação quando o item é solto \\

        // Identifica a coluna onde o item foi solto \\
        const colunaDestino = document
          .elementFromPoint(e.clientX, e.clientY)
          .closest(".coluna"); // Verifica onde o item foi solto \\

        if (colunaDestino) {
          const colunaId = colunaDestino.id; // Pega o ID da coluna (como "ul-Pendente") \\
          let novoStatusId;

          // Define o novo status baseado na coluna de destino \\
          switch (colunaId) {
            case "ul-Pendente":
              novoStatusId = 1; // Para "Pendente"
              break;
            case "ul-Andamento":
              novoStatusId = 2; // Para "Em Andamento"
              break;
            case "ul-Finalizado":
              novoStatusId = 3; // Para "Finalizado"
              break;
          }

          // Atualiza o status do pedido \\
          PUTPedidoCozinha(pedido.id, novoStatusId);
        }
      });
    });
  });
}

///////////////////////////////////// aqui começa a verificação para atualizar os pedidos pendentes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * Função simplificada para verificar novos pedidos pendentes
 * @param {Array} pedidos - Lista de pedidos pendentes
 * @returns {boolean} - Retorna true se houver novos pedidos
 */
async function verificarNovosPedidos(pedidos) {
  // coloca o array atual de pedidos pendentes no localStorage
  const local = JSON.parse(localStorage.getItem("pedidos"));
  console.log(local, "local");
  let temMudanca = false;

  if (local) {
    const res = await fetch(
      "https://comandaapilobo.somee.com/api/PedidoCozinhas?situacaoId=1"
    );
    const resJson = await res.json();
    console.log(resJson, "resjson");
    if (resJson.length != local.length) {
      temMudanca = true;
      localStorage.setItem("pedidos", JSON.stringify(resJson));
    } else {
      temMudanca = false;
    }
  }
  return temMudanca;
}

// Atualiza o setInterval para usar a nova lógica
iniciaTimeout();
function iniciaTimeout() {
  // sfx.autoplay = true;

  setInterval(async () => {
    console.log("entrou interval");
    const comparacao = await verificarNovosPedidos();
    console.log(comparacao, "procurando comparacao");
    if (comparacao) {
      // fazer tocar sonzinho será adicionado dps
      // Toca o som de notificação apenas quando houver novos pedidos
      // const sfx = new Audio("/audio/taco_bell_sfx.mpeg");
      // const div = document.querySelector(".p-div");
      // div.click();
      // sfx.play();
      console.log("Novos pedidos detectados");
      GETPedidoCozinha(1, "#ul-Pendente");
    } else {
      console.log("Nenhum novo pedido");
    }
  }, 15000);
}
// Atualiza o setInterval para usar a nova lógica

/////////////////////////////////////////////////////// aqui começa o modal \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Define o HTML do modal que será inserido no documento
const modalHTML = `
<div id="pedidoModal" class="modal">
    <div class="modal-content">
        <div>
          <span class="close-modal">&times;</span>
          <h2 id="modalTitulo"></h2>
        </div>
        <h2 id="modalmesa"></h2>
        <h2 id="modalnomeCliente"></h2>
        <button id="print">🖨 Imprimir</button>
    </div>
</div>
`;

// Adiciona o modal ao documento
document.body.insertAdjacentHTML("beforeend", modalHTML);

// Elementos do modal
const modal = document.getElementById("pedidoModal");
const closeBtn = document.querySelector(".close-modal");

// Fecha modal ao clicar no X
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// Fecha modal ao clicar fora
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/**
 * Função que recebe um objeto de pedido e gera uma impressão com os detalhes do cliente, mesa e itens.
 *
 * @param {Object} pedido - O pedido contendo informações do cliente, mesa e lista de produtos.
 * @param {string} pedido.nomeCliente - Nome do cliente.
 * @param {int} pedido.mesa - Número da mesa.
 * @param {string} pedido.titulo - nome do pedido.
 */
function imprimir(pedido) {
  // Inicializa o texto com o nome do cliente
  let texto = `Cliente: ${pedido.nomeCliente} <br>`;

  // Armazena a mesa do pedido
  let mesa = `Mesa: ${pedido.mesa}<br>`;

  // Armazena a lista de itens do pedido (título)
  let itens = `Pedido: ${pedido.titulo}`;

  // Combina as variáveis para formar o conteúdo a ser impresso
  texto += mesa + itens;

  // Cria uma nova janela pop-up para exibir o conteúdo a ser impresso
  const win = window.open("", "", "width=800,height=600");

  // Adiciona o conteúdo HTML à nova janela
  win.document.write("<html><head><title>Pedido</title>");
  win.document.write("</head><body>");
  win.document.write(texto);
  win.document.write("</body></html>");

  // Fecha o documento (necessário para o funcionamento correto no IE >= 10)
  win.document.close();

  // Foca na nova janela (necessário para o IE >= 10)
  win.focus();

  // Adiciona um pequeno atraso de 1 segundo antes de disparar a impressão
  setTimeout(function () {
    win.print(); // Dispara a impressão \\
    win.close(); // Fecha a janela após a impressão \\
  }, 1000);
}

// Função para mostrar o modal
function exibirDetalhesModal(pedido) {
  console.log("judas", pedido);
  // Preenche os elementos
  document.getElementById("modalTitulo").textContent = "🍔 " + pedido.titulo;
  document.getElementById("modalmesa").textContent =
    "Mesa: " + pedido.numeroMesa;
  document.getElementById("modalnomeCliente").textContent =
    "Cliente: " + pedido.nomeCliente;

  // Mostra o modal
  modal.style.display = "block";
  const btnPrint = document.querySelector("#print");
  btnPrint.addEventListener("click", () => {
    imprimir({ ...pedido, mesa: pedido.numeroMesa });
  });
}
