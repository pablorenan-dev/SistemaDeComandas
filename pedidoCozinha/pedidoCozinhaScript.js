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
async function GETPedidoCozinha(situacaoId, element) {
  let response = await fetch(
    `http://localhost:5164/api/PedidoCozinhas?situacaoId=${situacaoId}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  console.log(result);
  montarPedidoCozinha(result, element, situacaoId);
  return;
}

// Carrega inicialmente todos os pedidos \\
GETPedidoCozinha(1, "#ul-Pendente");
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
      `http://localhost:5164/api/PedidoCozinhas/${id}`,
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

  ///////////////////////////////////// aqui começa a verificação para atualizar o pedidos pendentes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Verifica se são pedidos pendentes (situacaoId === 1) para gerenciar notificações
  if (situacaoId === 1) {
    const pedidosPassados = JSON.parse(
      localStorage.getItem("pedidosPendentes") || "[]"
    );

    // Atualiza o localStorage com os novos pedidos
    localStorage.setItem(
      "pedidosPendentesAnteriores",
      JSON.stringify(pedidosPassados)
    );
    localStorage.setItem("pedidosPendentes", JSON.stringify(pedidos));
    localStorage.setItem("momentoUltimoUpdate", Date.now().toString());
  }
}

/**
 * Função simplificada para verificar novos pedidos pendentes
 * @param {Array} pedidosAntigos - Lista antiga de pedidos
 * @param {Array} pedidosNovos - Lista nova de pedidos
 * @returns {boolean} - Retorna true se houver novos pedidos
 */
function verificarNovosPedidos(pedidosAntigos, pedidosNovos) {
  // Se não houver pedidos anteriores, mas existem novos pedidos
  if (!pedidosAntigos.length && pedidosNovos.length > 0) {
    return true;
  }

  // Se a nova lista é maior que a antiga, significa que há novos pedidos
  if (pedidosNovos.length > pedidosAntigos.length) {
    return true;
  }

  // Verifica se há algum pedido novo que não estava na lista antiga
  const novoPedidoEncontrado = pedidosNovos.some((pedidoNovo) => {
    return !pedidosAntigos.some(
      (pedidoAntigo) => pedidoAntigo.id === pedidoNovo.id
    );
  });

  return novoPedidoEncontrado;
}

// Função que procura atualizações
function procuraUpdates() {
  // Obtém as listas de pedidos atual e anterior do localStorage
  const pedidosAtuais = JSON.parse(
    localStorage.getItem("pedidosPendentes") || "[]"
  );
  const pedidosPassados = JSON.parse(
    localStorage.getItem("pedidosPendentesAnteriores") || "[]"
  );

  // Verifica se há novos pedidos
  const temNovosPedidos = verificarNovosPedidos(pedidosPassados, pedidosAtuais);

  if (temNovosPedidos) {
    // Atualiza o localStorage apenas se houver novos pedidos
    localStorage.setItem(
      "pedidosPendentesAnteriores",
      JSON.stringify(pedidosPassados)
    );
    localStorage.setItem("pedidosPendentes", JSON.stringify(pedidosAtuais));
    localStorage.setItem("momentoUltimoUpdate", Date.now().toString());
  }

  return {
    teveMudancas: temNovosPedidos,
  };
}

// Atualiza o setInterval para usar a nova lógica
setInterval(() => {
  const updates = procuraUpdates();

  if (updates.teveMudancas) {
    // Toca o som de notificação apenas quando houver novos pedidos
    const sfx = new Audio("/audio/taco_bell_sfx.mpeg");
    sfx.play();
    console.log("Novos pedidos detectados");
    GETPedidoCozinha(1, "#ul-Pendente");
  } else {
    console.log("Nenhum novo pedido");
  }
}, 15000);

/////////////////////////////////////////////////////// aqui começa o modal \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Define o HTML do modal que será inserido no documento
const modalHTML = `
<div id="pedidoModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4); z-index: 1000;">
  <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 500px; border-radius: 5px; position: relative;">
    <span class="close-modal" style="position: absolute; right: 10px; top: 10px; font-size: 24px; cursor: pointer;">&times;</span>
    <h2 id="modalTitulo" style="margin-bottom: 15px;"></h2>
    <div id="modalDescricao"></div>
    <div id="modalItens" style="margin-top: 15px;"></div>
  </div>
</div>
`;

// Adiciona o HTML do modal ao body do documento
document.body.insertAdjacentHTML("beforeend", modalHTML);

// Seleciona os elementos do modal
const modal = document.getElementById("pedidoModal");
const closeModal = document.querySelector(".close-modal");

// Fecha o modal quando clicar no X
closeModal.onclick = function () {
  modal.style.display = "none";
};

// Fecha o modal quando clicar fora dele
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

/**
 * Exibe o modal com os detalhes do pedido
 * @param {Object} pedido - Objeto contendo os detalhes do pedido
 */
function exibirDetalhesModal(pedido) {
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescricao = document.getElementById("modalDescricao");
  const modalItens = document.getElementById("modalItens");

  // Limpa o conteúdo anterior do modal
  modalTitulo.textContent = "";
  modalDescricao.innerHTML = "";
  modalItens.innerHTML = "";

  // Preenche o título
  modalTitulo.textContent = pedido.titulo;

  // Preenche a descrição (se existir)
  if (pedido.descricao) {
    modalDescricao.innerHTML = `
      <p><strong>Descrição:</strong></p>
      <p>${pedido.descricao}</p>
    `;
  }

  // Preenche os itens do pedido (se existirem)
  if (pedido.itens && pedido.itens.length > 0) {
    const itensHTML = `
      <p><strong>Itens do Pedido:</strong></p>
      <ul style="list-style-type: disc; margin-left: 20px;">
        ${pedido.itens
          .map(
            (item) => `
          <li>
            ${item.quantidade}x ${item.nome}
            ${item.observacao ? `<br><em>Obs: ${item.observacao}</em>` : ""}
          </li>
        `
          )
          .join("")}
      </ul>
    `;
    modalItens.innerHTML = itensHTML;
  }

  // Exibe o modal
  modal.style.display = "block";
}

// Adiciona um evento de clique no h1 para retornar para o menu
function adicionarEventoCliqueH1Chiquinho() {
  const h1Chiquinho = document.querySelector(".h1-chiquinho");
  h1Chiquinho.addEventListener("click", () => {
    document.location.href = "http://127.0.0.1:5500/index.html";
  });
}

adicionarEventoCliqueH1Chiquinho();
