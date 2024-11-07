const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  
  // Get all orders from the API
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
  
  // Get all menu items from the API
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
  
  // Render orders list
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
            </div>
          </li>
          `
      );
    });
  }
  
  // Create and show edit modal
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
              </div>
              <div class="form-group">
                <label for="table-number">Número da Mesa:</label>
                <input type="text" id="table-number" value="${
                  order.numeroMesa
                }" />
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
  
  // Close edit modal
  function closeEditModal() {
    const modal = document.getElementById("edit-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Add item to the order
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
  
  // Remove item from the order
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
  
  // Render orders when the document is ready
  document.addEventListener("DOMContentLoaded", renderOrders);
  