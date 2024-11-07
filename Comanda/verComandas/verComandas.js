const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Função para buscar todas as comandas da API
async function getAllOrders() {
  try {
    const response = await fetch("http://localhost:5164/api/Comandas", {
      method: "GET",
      headers: header,
    });
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
    const response = await fetch("http://localhost:5164/api/CardapioItems", {
      method: "GET",
      headers: header,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

// Função para renderizar a lista de comandas
async function renderOrders() {
  const orders = await getAllOrders();
  const ordersList = document.querySelector("#lista-comandas");
  ordersList.innerHTML = "";

  orders.forEach((order) => {
    const items = Array.isArray(order.comandaItens) ? order.comandaItens : [];

    ordersList.insertAdjacentHTML(
      "beforeend",
      `
    <li id="order-${order.id}" class="order-item">
          <div class="order-info">
            <h3>Cliente: ${order.nomeCliente}</h3>
            <p>Mesa: ${order.numeroMesa}</p>
            <p>Itens: ${items.map((item) => item.titulo).join(", ")}</p>
          </div>
          <div class="order-actions">
            <button class="edit-button" onclick="openEditModal(${JSON.stringify(
              order
            ).replace(/"/g, "&quot;")})">
              ✏️ Editar
            </button>
            <button class="finalize-button" onclick="finalizeOrder(${order.id})">
              ✅ Finalizar Comanda
            </button>
          </div>
        </li>
      `
    );
  });
}

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
      `http://localhost:5164/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      alert("Nome do cliente atualizado com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      alert("Erro ao atualizar nome do cliente.");
    }
  } catch (error) {
    console.error("Error updating client name:", error);
    alert("Erro ao conectar com o servidor.");
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
      `http://localhost:5164/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      alert("Número da mesa atualizado com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      alert("Erro ao atualizar número da mesa.");
    }
  } catch (error) {
    console.error("Error updating table number:", error);
    alert("Erro ao conectar com o servidor.");
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
      `http://localhost:5164/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      alert("Item removido com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      alert("Erro ao remover item.");
      console.error("API response:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Erro ao conectar com o servidor.");
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
      `http://localhost:5164/api/Comandas/${orderId}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify(updatedOrder),
      }
    );

    if (response.ok) {
      alert("Item adicionado com sucesso!");
      closeEditModal();
      renderOrders();
    } else {
      alert("Erro ao adicionar item.");
      console.error("API response:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Erro ao conectar com o servidor.");
  }
}
async function finalizeOrder(orderId) {
  try {
    const response = await fetch(
      `http://localhost:5164/api/Comandas/${orderId}`, // Exemplo de endpoint
      {
        method: "PATCH",
        headers: header,
      }
    );

    if (response.ok) {
      alert("Comanda finalizada com sucesso!");
      renderOrders(); // Atualiza a lista de comandas
    } else {
      alert("Erro ao finalizar a comanda.");
      console.error("API response:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error finalizing order:", error);
    alert("Erro ao conectar com o servidor.");
  }
}
// Renderizar as comandas ao carregar o documento
document.addEventListener("DOMContentLoaded", renderOrders);
