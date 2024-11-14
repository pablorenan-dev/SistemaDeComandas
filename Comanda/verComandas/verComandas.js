const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Função para buscar todas as comandas da API
async function getAllOrders() {
  try {
    const response = await fetch(
      "http://comandaapilobo.somee.com/api/Comandas",
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
      "http://comandaapilobo.somee.com/api/CardapioItems",
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
            <p id="p-descricao">Itens: ${items
              .map((item) => item.titulo)
              .join("<br>• ")}</p>
          </div>
          <div class="order-actions">
            <button class="edit-button" onclick="openEditModal(${JSON.stringify(
              order
            ).replace(/"/g, "&quot;")})">
              ✏️ Editar
            </button>
            <button class="edit-button" onclick="finalizeOrder(${order.id})">
              ✅ Finalizar Comanda
            </button>
          </div>
        </li>
        `
    );
    let btnEditar = document.getElementById(`${comanda.id}edit`);
    btnEditar.addEventListener("click", () => {
      abrirModalEdicao(comanda);
    });
  });
}
montarComandas();
function criarModalEdicao(comanda) {
  // Verifica se o modal já existe, se não, cria-o
  console.log("começou");
  if (document.querySelector("#modal-editar-comanda")) return;
  console.log("passour");
  const modalHtml = `
      <div id="modal-editar-comanda" class="modal-wrapper" style="display: none;">
        <div class="modal">
          <div class="modal-header">
            <h2>Editar Comanda</h2>
            <button onclick="fecharModal()">X</button>
          </div>
          <div class="modal-body">
            <label for="nome-cliente-editar">Nome do Cliente:</label>
            <input type="text" id="nome-cliente-editar" placeholder="Nome do Cliente">
            
            <label for="mesa-editar">Número da Mesa:</label>
            <input type="text" id="mesa-editar" placeholder="Número da Mesa">
            
            <label for="itens-editar">Itens:</label>
            <textarea  rows="4" placeholder="Exemplo: Café, Bolo"></textarea>
              <select id="itens-editar"></select>
            <button class="button-geral" onclick="salvarEdicaoComanda()">Salvar</button>
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
      `http://comandaapilobo.somee.com/api/Comandas/${orderId}`,
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
      `http://comandaapilobo.somee.com/api/Comandas/${orderId}`,
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
      `http://comandaapilobo.somee.com/api/Comandas/${orderId}`,
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
      `http://comandaapilobo.somee.com/api/Comandas/${orderId}`,
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
      `http://comandaapilobo.somee.com/api/Comandas/${orderId}`, // Exemplo de endpoint
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
  // Remover o modal antigo, se já existir
  const oldModal = document.getElementById("alert-modal");
  if (oldModal) {
    oldModal.remove();
  }

  const modalHTML = `
    <div id="alert-modal" class="modal-wrapper">
      <div class="modal">
        <div class="modal-body">
          <p>${message}</p>
          <button onclick="closeAlertModal()" class="close-button">OK</button>
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
    window.location.href = "../login/index.html"; // Redireciona para a tela de login
  });
});
// Renderizar as comandas ao carregar o documento
document.addEventListener("DOMContentLoaded", renderOrders);
