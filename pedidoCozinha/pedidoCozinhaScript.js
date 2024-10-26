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
    `https://localhost:7168/api/PedidoCozinhas?situacaoId=${situacaoId}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  console.log(result);
  montarPedidoCozinha(result, element, situacaoId);
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
      GETPedidoCozinha(1, "#ul-Pendente");
      GETPedidoCozinha(2, "#ul-Andamento");
      GETPedidoCozinha(3, "#ul-Finalizado");
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
  // Se as quantidades são diferentes, houve mudança \\
  if (pedidosAntigos.length !== pedidosNovos.length) {
    return true;
  }

  // Cria conjuntos de IDs para comparação rápida \\
  const idsVelhos = new Set(pedidosAntigos.map((pedido) => pedido.id));
  const idsNovos = new Set(pedidosNovos.map((pedido) => pedido.id));

  // Verifica se algum ID existe em uma lista mas não na outra
  for (const idPedido of idsVelhos) {
    if (!idsNovos.has(idPedido)) return true;
  }

  for (const idPedido of idsNovos) {
    if (!idsVelhos.has(idPedido)) return true;
  }

  return false;
}

/**
 * Verifica se houve atualizações nos últimos 30 segundos
 * @returns {boolean} - Retorna true se houver atualizações
 */
function procuraUpdates() {
  const momentoUltimoUpdate =
    localStorage.getItem("momentoUltimoUpdate") || "0";
  const momentoAtual = Date.now();
  const trintaSegundosAtras = momentoAtual - 30000;

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
    teveUpdateRecente: parseInt(momentoUltimoUpdate) > trintaSegundosAtras,
    teveMudancas: teveMudancas,
  };
}

if (situacaoId === 1) {
  const pedidosPassados = JSON.parse(
    localStorage.getItem("pedidosPendentes") || "[]"
  );

  // Verifica se há mudanças nos pedidos
  if (teveTrocaNosPedidos(pedidosPassados, result)) {
    // Guarda o estado anterior antes de atualizar
    localStorage.setItem(
      "pedidosPendentesAnteriores",
      JSON.stringify(pedidosPassados)
    );
    // Atualiza com os novos pedidos
    localStorage.setItem("pedidosPendentes", JSON.stringify(result));
    localStorage.setItem("momentoUltimoUpdate", Date.now().toString());
    sfx.play(); // Toca o som quando a requisição é iniciada \\

    console.log("Mudanças detectadas nos pedidos:");
    console.log(
      "Pedidos removidos:",
      previousOrders.filter(
        (antigo) =>
          !result.some((pedidosNovos) => pedidosNovos.id === antigo.id)
      )
    );
    console.log(
      "Pedidos adicionados:",
      result.filter(
        (pedidosNovos) =>
          !previousOrders.some((antigo) => antigo.id === pedidosNovos.id)
      )
    );
  }
}

// Inicializa o objeto de áudio para notificação sonora \\
const sfx = new Audio("/audio/taco_bell_sfx.mpeg");

/**
 * Monta a interface dos pedidos na cozinha e configura o sistema de drag and drop
 * @param {Array} pedidos - Array de pedidos a serem exibidos
 * @param {string} element - Seletor CSS do elemento onde os pedidos serão exibidos
 * @param {number} finish - Status atual dos pedidos sendo montados
 */
function montarPedidoCozinha(pedidos, element, finish) {
  console.log(finish, "finish");
  let ulPedidoCozinhaItens = document.querySelector(element);
  ulPedidoCozinhaItens.innerHTML = "";

  // Itera sobre cada pedido e cria os elementos na interface \\
  pedidos.forEach((pedido) => {
    ulPedidoCozinhaItens.insertAdjacentHTML(
      "beforeend",
      `
      <li draggable="true" id="mover${pedido.id}">
      <p>${pedido.titulo}</p>
      </li>
      `
    );

    // Configura o sistema de drag and drop \\
    const columns = document.querySelectorAll(".coluna");
    const mover = document.getElementById(`mover${pedido.id}`);

    // Adiciona classe visual durante o arrasto \\
    document.addEventListener("dragstart", (e) => {
      e.target.classList.add("dragging");
    });

    // Configura o evento de soltar o item para cada coluna
    columns.forEach((item) => {
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

// Configura atualização automática dos pedidos pendentes a cada 30 segundos \\
setInterval(() => {
  const updates = procuraUpdates();

  if (updates.teveMudancas || updates.teveMudancas) {
    console.log("Atualizações ou mudanças detectadas");
    GETPedidoCozinha(1, "#ul-Pendente");
  } else {
    console.log("Nenhuma atualização ou mudança recente");
  }
}, 30000);
