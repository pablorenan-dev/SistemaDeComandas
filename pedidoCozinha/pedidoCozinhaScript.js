// Define os cabeçalhos padrão para as requisições HTTP \\
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
    `https://localhost:7129/api/PedidoCozinhas?situacaoId=${situacaoId}`,
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
      `https://localhost:7129/api/PedidoCozinhas/${id}`,
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
        <p>${pedido.item}</p>
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

  // Verifica se são pedidos pendentes (situacaoId === 1) para gerenciar notificações
  if (situacaoId === 1) {
    const pedidosPassados = JSON.parse(
      localStorage.getItem("pedidosPendentes") || "[]"
    );

    // Só atualiza se realmente houver mudanças
    if (teveTrocaNosPedidos(pedidosPassados, pedidos)) {
      localStorage.setItem(
        "pedidosPendentesAnteriores",
        JSON.stringify(pedidosPassados)
      );
      localStorage.setItem("pedidosPendentes", JSON.stringify(pedidos));
      localStorage.setItem("momentoUltimoUpdate", Date.now().toString());

      console.log("Mudanças detectadas:");
      console.log(
        "Pedidos removidos:",
        pedidosPassados.filter(
          (antigo) => !pedidos.some((novo) => novo.id === antigo.id)
        )
      );
      console.log(
        "Pedidos adicionados:",
        pedidos.filter(
          (novo) => !pedidosPassados.some((antigo) => antigo.id === novo.id)
        )
      );
    }
  }
}

/**
 * Compara duas listas de pedidos para detectar mudanças
 * @param {Array} pedidosAntigos - Lista antiga de pedidos
 * @param {Array} pedidosNovos - Lista nova de pedidos
 * @returns {boolean} - Retorna true se houver diferenças
 */
function teveTrocaNosPedidos(pedidosAntigos, pedidosNovos) {
  // Se alguma das listas é null ou undefined, não considera como mudança
  if (!pedidosAntigos || !pedidosNovos) return false;

  // Se as quantidades são diferentes, houve mudança
  if (pedidosAntigos.length !== pedidosNovos.length) {
    return true;
  }

  // Compara cada pedido
  return pedidosAntigosOrdenados.some((pedidoAntigo, index) => {
    const pedidoNovo = pedidosNovosOrdenados[index];
    return pedidoAntigo.id !== pedidoNovo.id;
  });
}

/**
 * Verifica se houve atualizações nos últimos 30 segundos
 * @returns {boolean} - Retorna true se houver atualizações
 */
function procuraUpdates() {
  const momentoUltimoUpdate =
    localStorage.getItem("momentoUltimoUpdate") || "0";
  const momentoAtual = Date.now();
  const quinzeSegundosAtras = momentoAtual - 15000;

  // Obtém as listas de pedidos atual e anterior
  const pedidosAtuais = JSON.parse(
    localStorage.getItem("pedidosPendentes") || "[]"
  );
  const pedidosPassados = JSON.parse(
    localStorage.getItem("pedidosPendentesAnteriores") || "[]"
  );

  // Verifica se houve mudança nos pedidos
  const teveMudancas = teveTrocaNosPedidos(pedidosPassados, pedidosAtuais);

  return {
    teveUpdateRecente: parseInt(momentoUltimoUpdate) > quinzeSegundosAtras,
    teveMudancas: teveMudancas,
  };
}

// Inicializa o objeto de áudio para notificação sonora
const sfx = new Audio("/audio/taco_bell_sfx.mpeg");

setInterval(() => {
  const updates = procuraUpdates();

  // Corrigido a condição de verificação
  if (updates.teveMudancas) {
    sfx.play();
    console.log("Mudanças detectadas nos pedidos");
    GETPedidoCozinha(1, "#ul-Pendente");
  } else {
    console.log("Nenhuma mudança recente");
  }
}, 15000);

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
