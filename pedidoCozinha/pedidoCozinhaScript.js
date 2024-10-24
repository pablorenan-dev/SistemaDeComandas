// Define os cabeçalhos padrão para as requisições HTTP \\
const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Inicializa o objeto de áudio para notificação sonora \\
const sfx = new Audio("/audio/taco_bell_sfx.mpeg");

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
  sfx.play(); // Toca o som quando a requisição é iniciada \\

  GETPedidoCozinha(1, "#ul-Pendente");
  console.log("interval");
}, 30000);

// Carrega inicialmente todos os pedidos \\
GETPedidoCozinha(1, "#ul-Pendente");
GETPedidoCozinha(2, "#ul-Andamento");
GETPedidoCozinha(3, "#ul-Finalizado");
