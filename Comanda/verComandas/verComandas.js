const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Get all orders from the API
async function getAllOrders() {
  try {
    const response = await fetch("https://localhost:7168/api/Comandas", {
      method: "GET",
      headers: header
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
    const response = await fetch("https://localhost:7168/api/CardapioItems", {
      method: "GET",
      headers: header
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
  ordersList.innerHTML = '';

  orders.forEach((order) => {
    const items = Array.isArray(order.comandaItens) 
      ? order.comandaItens
      : [];
      
    ordersList.insertAdjacentHTML(
      "beforeend",
      `
      <li id="order-${order.id}" class="order-item">
        <div class="order-info">
          <h3>Cliente: ${order.nomeCliente}</h3>
          <p>Mesa: ${order.numeroMesa}</p>
          <p>Itens: ${items.map(item => item.titulo).join(", ")}</p>
        </div>
        <div class="order-actions">
          <button class="edit-button" onclick="openEditModal(${JSON.stringify(order).replace(/"/g, '&quot;')})">
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
            <input type="text" id="client-name" value="${order.nomeCliente}" />
          </div>
          <div class="form-group">
            <label for="table-number">Número da Mesa:</label>
            <input type="text" id="table-number" value="${order.numeroMesa}" />
          </div>
          <div class="form-group">
            <label>Itens da Comanda:</label>
            <div id="order-items" class="order-items-list">
            ${Array.isArray(order.comandaItens) ? order.comandaItens.map(item => `
              <div class="order-item" id="item-${item.id}">
                <span>${item.titulo}</span>
                <button onclick="removeItem(${item.id})" class="remove-item">✕</button>
              </div>
            `).join('') : ''}
            </div>
          </div>
          <div class="form-group">
            <label for="add-item">Adicionar Item:</label>
            <select id="add-item">
              <option value="">Selecione um item...</option>
              ${menuItems.map(item => `
                <option value="${item.id}">${item.titulo}</option>
              `).join('')}
            </select>
            <button onclick="addItem()" class="add-button">Adicionar</button>
          </div>
          <div class="modal-actions">
            <button onclick="saveOrder(${order.id})" class="save-button">Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Store current items for reference
  window.currentItems = new Set(
    Array.isArray(order.comandaItens) ? order.comandaItens.map(item => item.id) : []
  );
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  if (modal) {
    modal.remove();
  }
}

async function addItem() {
  const select = document.getElementById('add-item');
  const itemId = select.value;
  
  if (!itemId || window.currentItems.has(parseInt(itemId))) {
    return;
  }
  
  const menuItems = await getMenuItems();
  const item = menuItems.find(i => i.id === parseInt(itemId));
  
  if (item) {
    const orderItems = document.getElementById('order-items');
    orderItems.insertAdjacentHTML('beforeend', `
      <div class="order-item" id="item-${item.id}">
        <span>${item.titulo}</span>
        <button onclick="removeItem(${item.id})" class="remove-item">✕</button>
      </div>
    `);
    
    window.currentItems.add(item.id);
  }
}

function removeItem(itemId) {
  const itemElement = document.getElementById(`item-${itemId}`);
  if (itemElement) {
    itemElement.remove();
    window.currentItems.delete(itemId);
  }
}

async function saveOrder(orderId) {
  const clientName = document.getElementById('client-name').value;
  const tableNumber = document.getElementById('table-number').value;
  
  if (!clientName || !tableNumber) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  const updatedOrder = {
    id: orderId,
    nomeCliente: clientName,
    numeroMesa: tableNumber,
    cardapioItems: Array.from(window.currentItems)
  };
  
  try {
    const response = await fetch(`https://localhost:7168/api/Comandas/${orderId}`, {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(updatedOrder)
    });
    
    if (response.ok) {
      alert('Comanda atualizada com sucesso!');
      closeEditModal();
      renderOrders(); // Refresh the orders list
    } else {
      alert('Erro ao atualizar comanda.');
    }
  } catch (error) {
    console.error('Error updating order:', error);
    alert('Erro ao conectar com o servidor.');
  }
}

// Add necessary styles
const styles = `
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .order-items-list {
    margin: 1rem 0;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0.5rem;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .remove-item {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }
  
  .add-button,
  .save-button {
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin-top: 0.5rem;
  }
  
  .edit-button {
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize the application
document.addEventListener('DOMContentLoaded', renderOrders);