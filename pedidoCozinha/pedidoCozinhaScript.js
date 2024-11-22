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
        <p>${pedido.titulo}</p>
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
  }, 5000);
}
// Atualiza o setInterval para usar a nova lógica

/////////////////////////////////////////////////////// aqui começa o modal \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Define o HTML do modal que será inserido no documento
const modalHTML = `
<div id="pedidoModal" class="modal">
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2 id="modalTitulo"></h2>
        <h2 id="modalmesa"></h2>
        <div id="modalDescricao"></div>
        <div id="modalItens"></div>
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

// Função para mostrar o modal
function exibirDetalhesModal(pedido) {
  // Preenche os elementos
  document.getElementById("modalTitulo").textContent = pedido.titulo;
  document.getElementById("modalmesa").textContent =
    "Mesa: " + pedido.numeroMesa;
  // document.getElementById("modalDescricao").innerHTML = pedido.adicionais // adicionar função de localStorage para pegar os adicionais do pedido mais tarde \\\\
  document.getElementById("modalDescricao").innerHTML = pedido.descricao
    ? `<p><strong>Descrição:</strong> ${pedido.descricao}</p>`
    : "";

  // Preenche os itens se existirem
  const modalItens = document.getElementById("modalItens");
  if (pedido.itens && pedido.itens.length > 0) {
    modalItens.innerHTML = `
            <p><strong>Itens:</strong></p>
            <ul>
                ${pedido.itens
                  .map(
                    (item) => `
                    <li>${item.quantidade}x ${item.titulo}
                        ${item.observacao ? ` - Obs: ${item.observacao}` : ""}
                    </li>
                `
                  )
                  .join("")}
            </ul>
        `;
  }

  // Mostra o modal
  modal.style.display = "block";
}
