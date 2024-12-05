const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Função para buscar todas as comandas da API
async function getAllOrders() {
  try {
    const response = await fetch(
      "https://comandaapilobo.somee.com/api/Comandas",
      {
        method: "GET",
        headers: header,
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Função para buscar todos os itens do cardápio da API
async function getMenuItems() {
  try {
    const response = await fetch(
      "https://comandaapilobo.somee.com/api/CardapioItems",
      {
        method: "GET",
        headers: header,
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

// Atualizar a função renderOrders com a lógica de carregamento
async function renderOrders() {
  const ordersList = document.querySelector("#lista-comandas");

  mostrarCarregamento(); // Mantém o carregamento

  try {
    const orders = await getAllOrders();
    ordersList.innerHTML = ""; // Limpa a lista antes de carregar

    if (orders.length === 0) {
      ordersList.innerHTML = `
        <li class="no-orders">
          <div class="no-orders-info">
            <h3>Nenhuma comanda encontrada.</h3>
          </div>
        </li>`;
      return;
    }

    // Renderiza cada comanda
    orders.forEach((order) => {
      const items = Array.isArray(order.comandaItens) ? order.comandaItens : [];

      ordersList.insertAdjacentHTML(
        "beforeend",
        `
        <li id="order-${order.id}" class="order-item">
          <div class="order-info">
            <h3>Cliente: ${order.nomeCliente}</h3>
            <p>Mesa: ${order.numeroMesa}</p>
            <p>Itens: <br>• ${items
              .map((item) => item.titulo)
              .join("<br>• ")}</p>
          </div>
          <div class="order-actions">
            <button class="edit-button" onclick="openEditModal(${JSON.stringify(
              order
            ).replace(/"/g, "&quot;")})">✏️ Editar</button>
            <button class="edit-button" onclick="finalizeOrder(${
              order.id
            })">✅ Finalizar Comanda</button>
            <button class="edit-button" onclick="getOrderDataForPrint(${
              order.id
            })">🖨️ Imprimir</button>
          </div>
        </li>`
      );
    });
  } catch (error) {
    console.error("Erro ao buscar comandas:", error);
    ordersList.innerHTML = `<li class="error-item">...</li>`;
  }
}

// Atualiza a lista ao carregar a página
document.addEventListener("DOMContentLoaded", renderOrders);

// Função para abrir o modal de edição
async function openEditModal(order) {
  const menuItems = await getMenuItems();

  const modalHTML = `
      <div id="edit-modal" class="modal-wrapper">
        <div class="modal">
          <div class="modal-header">
            <h2>Editar Comanda</h2>
            <button onclick="closeEditModal()" class="close-button">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="client-name">Nome do Cliente:</label>
              <input type="text" id="client-name" value="${
                order.nomeCliente
              }" />
              <button onclick="confirmClientName(${
                order.id
              })" class="confirm-button">✔️</button>
            </div>
            <div class="form-group">
              <label for="table-number">Número da Mesa:</label>
              <input type="text" id="table-number" value="${
                order.numeroMesa
              }" />
              <button onclick="confirmTableNumber(${
                order.id
              })" class="confirm-button">✔️</button>
            </div>
            <div class="form-group">
              <label>Itens da Comanda:</label>
              <div id="order-items" class="order-items-list">
              ${
                Array.isArray(order.comandaItens)
                  ? order.comandaItens
                      .map(
                        (item) => `
                <div class="order-item" id="item-${item.id}">
                  <span>${item.titulo}</span>
                  <button onclick="removeItem(${order.id}, ${item.id}, ${order.numeroMesa}, '${order.nomeCliente}')" class="remove-item">✕</button>
                </div>
              `
                      )
                      .join("")
                  : ""
              }
              </div>
            </div>
            <div class="form-group">
              <label for="add-item">Adicionar Item:</label>
              <select id="add-item">
                <option value="">Selecione um item...</option>
                ${menuItems
                  .map(
                    (item) => `
                  <option value="${item.id}">${item.titulo}</option>
                `
                  )
                  .join("")}
              </select>
              <button onclick="addItem(${order.id}, ${order.numeroMesa}, '${
    order.nomeCliente
  }')" class="add-button">Adicionar</button>
            </div>
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Função para fechar o modal de edição
function closeEditModal() {
  const modal = document.getElementById("edit-modal");
  if (modal) {
    modal.remove();
  }
}

// Função para confirmar a alteração do nome do cliente
async function confirmClientName(orderId) {
  const clientNameInput = document.getElementById("client-name").value;

  const updatedOrder = {
    id: orderId,
    numeroMesa: 0, // Deixe como 0 se não for alterar a mesa
    nomeCliente: clientNameInput,
    comandaItens: [
      {
        cardapioItemId: 0,
        id: 0,
        excluir: false,
        incluir: false,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://comandaapilobo.somee.com/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      showAlertModal("Nome do cliente atualizado com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      showAlertModal("Erro ao atualizar nome do cliente.");
    }
  } catch (error) {
    console.error("Error updating client name:", error);
    showAlertModal("Erro ao conectar com o servidor.");
  }
}

// Função para confirmar a alteração do número da mesa
async function confirmTableNumber(orderId) {
  const tableNumberInput = document.getElementById("table-number").value;

  const updatedOrder = {
    id: orderId,
    numeroMesa: parseInt(tableNumberInput, 10),
    nomeCliente: "", // Deixe como string vazia se não for alterar o nome
    comandaItens: [
      {
        cardapioItemId: 0,
        id: 0,
        excluir: false,
        incluir: false,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://comandaapilobo.somee.com/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      showAlertModal("Número da mesa atualizado com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      showAlertModal("Erro ao atualizar número da mesa.");
    }
  } catch (error) {
    console.error("Error updating table number:", error);
    showAlertModal("Erro ao conectar com o servidor.");
  }
}

async function removeItem(orderId, itemId, tableNumber, clientName) {
  const updatedOrder = {
    id: orderId,
    numeroMesa: 0,
    nomeCliente: clientName,
    comandaItens: [
      {
        cardapioItemId: 0, // Pode ser qualquer valor, como mencionado
        id: itemId,
        excluir: true,
        incluir: false,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://comandaapilobo.somee.com/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      showAlertModal("Item removido com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      showAlertModal("Erro ao remover item.");
      console.error("API response:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error removing item:", error);
    showAlertModal("Erro ao conectar com o servidor.");
  }
}

async function addItem(orderId, tableNumber, clientName) {
  const select = document.getElementById("add-item");
  const cardapioItemId = parseInt(select.value);

  if (!cardapioItemId) {
    return;
  }

  const updatedOrder = {
    id: orderId,
    numeroMesa: 0,
    nomeCliente: clientName,
    comandaItens: [
      {
        cardapioItemId: cardapioItemId, // ID do item do cardápio a ser incluído
        id: 0, // ID do item na comanda (0 para novo)
        excluir: false,
        incluir: true,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://comandaapilobo.somee.com/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      showAlertModal("Item adicionado com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      showAlertModal("Erro ao adicionar item.");
      console.error("API response:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error adding item:", error);
    showAlertModal("Erro ao conectar com o servidor.");
  }
}

async function finalizeOrder(orderId) {
  try {
    const response = await fetch(
      `https://comandaapilobo.somee.com/api/Comandas/${orderId}`, // Exemplo de endpoint
      {
        method: "PATCH",
        headers: header,
      }
    );

    if (response.ok) {
      showAlertModal("Comanda finalizada com sucesso!");
      renderOrders(); // Atualiza a lista de comandas
    } else {
      showAlertModal("Erro ao finalizar a comanda.");
      console.error("API response:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error finalizing order:", error);
    showAlertModal("Erro ao conectar com o servidor.");
  }
}

function showAlertModal(message) {
  // Remove o modal antigo, se já existir
  const oldModal = document.getElementById("alert-modal");
  if (oldModal) {
    oldModal.remove();
  }

  // Adiciona o modal estilizado para finalizar comanda
  const modalHTML = `
    <div id="alert-modal" class="modal-wrapper finalize-order-modal">
      <div class="modal finalize-order">
        <div class="modal-header">Atenção</div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-actions">
          <button class="modal-button" onclick="confirmFinalizeOrder()">Confirmar</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Função para fechar o modal de aviso
function closeAlertModal() {
  const modal = document.getElementById("alert-modal");
  if (modal) {
    modal.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const avatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");

  avatar.addEventListener("click", () => {
    logoutBtn.classList.toggle("show");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioInfo");
    window.location.href = "../login/index.html"; // Redireciona para a tela de login
  });

  let userInfo = pegarInfoUsuarioLocalStorage();
  mudarNomeDoUsuario(userInfo);
});

function filterOrders() {
  const searchInput = document
    .getElementById("input-procurar")
    .value.toLowerCase();
  const orders = document.querySelectorAll("#lista-comandas .order-item");

  orders.forEach((order) => {
    const clientName = order.querySelector("h3").textContent.toLowerCase();
    const tableNumber = order
      .querySelector("p:nth-child(2)")
      .textContent.toLowerCase();
    const items = order
      .querySelector("p#p-descricao")
      .textContent.toLowerCase();

    if (
      clientName.includes(searchInput) ||
      tableNumber.includes(searchInput) ||
      items.includes(searchInput)
    ) {
      order.style.display = ""; // Mostra a comanda
    } else {
      order.style.display = "none"; // Esconde a comanda
    }
  });
}
// Adiciona o evento de input para o campo de busca
document
  .getElementById("input-procurar")
  .addEventListener("input", filterOrders);

// Renderizar as comandas ao carregar o documento
document.addEventListener("DOMContentLoaded", renderOrders);

function confirmFinalizeOrder() {
  closeAlertModal(); // Fecha o modal
  renderOrders(); // Atualiza as comandas
}

// Função para exibir uma mensagem de carregamento
function mostrarCarregamento() {
  const ordersList = document.querySelector("#lista-comandas");
  ordersList.innerHTML = `
    <li class="loading-item">
      <div class="loading-info">
        <h3>Carregando...</h3>
      </div>
    </li>`;
}
async function getOrderDataForPrint(orderId) {
  try {
    const [orders, menuItems] = await Promise.all([
      getAllOrders(),
      getMenuItems(),
    ]);

    // Encontre a comanda pelo ID
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      alert("Comanda não encontrada.");
      return;
    }

    // Crie um mapa do cardápio para acesso rápido
    const menuMap = {};
    menuItems.forEach((item) => {
      menuMap[item.titulo] = { preco: item.preco || 0 };
    });

    // Ajustar os itens da comanda para incluir preços e evitar duplicatas
    const itensAtualizados = [];
    order.comandaItens.forEach((comandaItem) => {
      const { titulo, quantidade } = comandaItem;

      // Verifica se o item já existe na lista atualizada
      const itemExistente = itensAtualizados.find(
        (item) => item.titulo === titulo
      );
      if (itemExistente) {
        // Incrementa a quantidade se o item já existir
        itemExistente.quantidade += quantidade || 1;
      } else {
        // Adiciona um novo item com preço do cardápio
        const preco = menuMap[titulo]?.preco || 0;
        itensAtualizados.push({
          titulo,
          quantidade: quantidade || 1,
          preco,
        });
      }
    });

    // Atualiza os itens na ordem
    order.comandaItens = itensAtualizados;

    // Crie a lista final para impressão
    const itemsWithPrices = order.comandaItens.map((item) => ({
      titulo: item.titulo,
      quantidade: item.quantidade,
      precoUnitario: item.preco,
      total: item.preco * item.quantidade,
    }));

    // Chama a função de impressão
    printOrder(order, itemsWithPrices);
  } catch (error) {
    console.error("Erro ao preparar dados para impressão:", error);
    alert("Erro ao buscar dados para impressão.");
  }
}

function printOrder(order, items) {
  let printContent = `
    <html>
      <head>
        <title>Comanda</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 70%; /* Reduz a largura da tabela */
            margin: 0 auto; /* Centraliza a tabela na página */
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: center; /* Centraliza todo o texto */
            font-size: 12px; /* Diminui o tamanho da fonte */
          }
          th {
            background-color: #f2f2f2;
          }
          td:nth-child(4) { /* Coluna "Total" */
            text-align: right; /* Alinha valores à direita */
            padding-right: 10px;
          }
          tfoot td {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">Comanda</h1>
        <p><strong>Cliente:</strong> ${order.nomeCliente}</p>
        <p><strong>Mesa:</strong> ${order.numeroMesa}</p>
        <hr>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qntd</th>
              <th>Preço Unt</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Adiciona os itens na tabela
  items.forEach((item) => {
    printContent += `
      <tr>
        <td>${item.titulo}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.precoUnitario.toFixed(2)}</td>
        <td>R$ ${item.total.toFixed(2)}</td>
      </tr>
    `;
  });

  // Calcula e insere o total geral
  const totalGeral = items.reduce((sum, item) => sum + item.total, 0);
  printContent += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Geral</td>
              <td>R$ ${totalGeral.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

  // Cria a janela de impressão
  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}

function pegarInfoUsuarioLocalStorage() {
  let usuarioInfo = localStorage.getItem("usuarioInfo");
  usuarioInfo = JSON.parse(usuarioInfo);
  return usuarioInfo;
}

function mudarNomeDoUsuario(usuarioInfo) {
  let usuarioP = document.getElementById("p-username");
  usuarioP.innerHTML = usuarioInfo.username;
}

async function printOrders() {
  try {
    const orderData = await fetchOrderData(); // Função assíncrona que busca dados
    const formattedData = getOrderDataForPrint(orderData);
    print(formattedData);
  } catch (error) {
    console.error("Erro ao buscar a comanda:", error);
  }
}
