/////////////////////////////////////// Define os cabeçalhos padrão para as requisições HTTP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Busca os pedidos da cozinha baseado no status (situação) e atualiza a interface
 * @param {number} situacaoId - ID do status do pedido (1: pendente, 2: em andamento, 3: finalizado)
 * @param {string} element - Seletor CSS do elemento onde os pedidos serão exibidos
 * @param {boolean} initial - Indica se é a primeira busca de pedidos
 */
async function GETPedidoCozinha(situacaoId, element, initial = false) {
  // Faz uma requisição para buscar pedidos com base no status
  let response = await fetch(
    `https://comandaapilobo.somee.com/api/PedidoCozinhas?situacaoId=${situacaoId}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();

  // Salva os pedidos no localStorage na primeira chamada
  if (initial) {
    localStorage.setItem("pedidos", JSON.stringify(result));
  }
  // Monta a interface com os pedidos e verifica se há novos pedidos
  montarPedidoCozinha(result, element, situacaoId);
  verificarNovosPedidos(result);
  return;
}

// Carrega todos os pedidos em diferentes status quando a tela é aberta
GETPedidoCozinha(1, "#ul-Pendente", true); // pedidos pendentes
GETPedidoCozinha(2, "#ul-Andamento"); // pedidos em andamento
GETPedidoCozinha(3, "#ul-Finalizado"); // pedidos finalizados

/**
 * Atualiza o status de um pedido específico na cozinha
 * @param {number} id - ID do pedido a ser atualizado
 * @param {number} situacaoId - Novo status do pedido (1: pendente, 2: em andamento, 3: finalizado)
 */
async function PUTPedidoCozinha(id, situacaoId) {
  const body = {
    novoStatusId: situacaoId,
  };

  let response = await fetch(
    `https://comandaapilobo.somee.com/api/PedidoCozinhas/${id}`,
    {
      method: "PUT",
      headers: header,
      body: JSON.stringify(body),
    }
  );

  // Se a atualização for bem-sucedida, atualiza todas as listas de pedidos
  if (response.ok) {
    await GETPedidoCozinha(1, "#ul-Pendente");
    await GETPedidoCozinha(2, "#ul-Andamento");
    await GETPedidoCozinha(3, "#ul-Finalizado");
  }
}

////////////////////////////////////////////////// aqui começa a construção da tela da tela \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * Cria o elemento HTML para um pedido
 * @param {Object} pedido - Objeto do pedido
 * @param {number} situacaoId - Status atual do pedido
 * @returns {string} HTML do pedido
 */
function criarElementoPedido(pedido, situacaoId) {
  return `
    <li draggable="true" id="mover${pedido.id}" data-id=${situacaoId} class="pedido-item">
      <p>Mesa: ${pedido.numeroMesa} | ${pedido.titulo}</p>
    </li>
  `;
}

/**
 * Configura o evento de clique para exibir detalhes do pedido
 * @param {HTMLElement} pedidoElement - Elemento do pedido
 * @param {Object} pedido - Dados do pedido
 */
function configurarEventoCliquePedido(pedidoElement, pedido) {
  pedidoElement.addEventListener("click", () => {
    exibirDetalhesModal(pedido, pedidoElement);
  });
}

/**
 * Configura eventos de drag and drop para mover pedidos entre colunas
 * @param {HTMLElement} mover - Elemento que será arrastado
 * @param {Object} pedido - Dados do pedido
 */
function configurarDragAndDrop(mover, pedido) {
  const colunas = document.querySelectorAll(".coluna");

  // Evento de início do arrasto
  document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });

  // Eventos de fim do arrasto para cada coluna
  colunas.forEach((item) => {
    mover.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");

      // Identifica a coluna de destino
      const colunaDestino = document
        .elementFromPoint(e.clientX, e.clientY)
        .closest(".coluna");

      if (colunaDestino) {
        const colunaId = colunaDestino.id;
        let novoStatusId;

        // Determina o novo status baseado na coluna de destino
        switch (colunaId) {
          case "ul-Pendente":
            novoStatusId = 1;
            break;
          case "ul-Andamento":
            novoStatusId = 2;
            break;
          case "ul-Finalizado":
            novoStatusId = 3;
            break;
        }

        // Atualiza o status do pedido
        PUTPedidoCozinha(pedido.id, novoStatusId);
      }
    });
  });
}

/**
 * Monta a lista de pedidos na interface
 * @param {Array} pedidos - Lista de pedidos
 * @param {string} element - Seletor do elemento onde os pedidos serão exibidos
 * @param {number} situacaoId - Status atual dos pedidos
 */
function montarPedidoCozinha(pedidos, element, situacaoId) {
  let ulPedidoCozinhaItens = document.querySelector(element);
  ulPedidoCozinhaItens.innerHTML = "";

  // Itera sobre cada pedido e cria os elementos na interface
  pedidos.forEach((pedido) => {
    // Cria o elemento HTML do pedido
    const pedidoHTML = criarElementoPedido(pedido, situacaoId);
    ulPedidoCozinhaItens.insertAdjacentHTML("beforeend", pedidoHTML);

    // Seleciona o elemento recem-criado
    const pedidoElement = document.getElementById(`mover${pedido.id}`);

    // Configura eventos de clique
    configurarEventoCliquePedido(pedidoElement, pedido);

    // Configura drag and drop
    configurarDragAndDrop(pedidoElement, pedido);
  });
}

///////////////////////////////////////// aqui começa a verificação para atualizar os pedidos pendentes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * Verifica se há novos pedidos pendentes
 * @param {Array} pedidos - Lista de pedidos pendentes
 * @returns {boolean} - Retorna true se houver novos pedidos
 */
async function verificarNovosPedidos(pedidos) {
  // Recupera os pedidos salvos anteriormente no localStorage
  const local = JSON.parse(localStorage.getItem("pedidos"));

  let temMudanca = false;

  if (local) {
    // Busca novamente os pedidos pendentes
    const res = await fetch(
      "https://comandaapilobo.somee.com/api/PedidoCozinhas?situacaoId=1"
    );
    const resJson = await res.json();

    // Verifica se o número de pedidos mudou
    if (resJson.length != local.length) {
      temMudanca = true;
      localStorage.setItem("pedidos", JSON.stringify(resJson));
    } else {
      temMudanca = false;
    }
  }
  return temMudanca;
}

// Inicia um intervalo para verificar novos pedidos periodicamente
iniciaTimeout();
function iniciaTimeout() {
  setInterval(async () => {
    const comparacao = await verificarNovosPedidos();

    // Se houver novos pedidos, atualiza a lista de pedidos pendentes
    if (comparacao) {
      GETPedidoCozinha(1, "#ul-Pendente");
    }
  }, 30000); // Verifica a cada 30 segundos
}
// Atualiza o setInterval para usar a nova lógica

/////////////////////////////////////////////////////// aqui começa o modal \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * Monta o HTML do modal de detalhes do pedido
 * @param {boolean} pendente - Indica se o pedido está pendente
 * @param {boolean} finalizado - Indica se o pedido está finalizado
 * @returns {string} HTML do modal
 */
function montarModal(pendente, finalizado) {
  return `
<div id="pedidoModal" class="modal">
    <div class="modal-content">
        <div>
          <span class="close-modal">&times;</span>
          <h2 id="modalTitulo"></h2>
        </div>
        <h2 id="modalmesa"></h2>
        <h2 id="modalnomeCliente"></h2>
        ${pendente ? `<button id="print">🖨 Imprimir</button>` : ""}
        ${finalizado ? `<button id="entregue">Entregue</button>` : ""}
    </div>
</div>
`;
}

/**
 * Função para imprimir os detalhes do pedido
 * @param {Object} pedido - Detalhes do pedido a serem impressos
 */
function imprimir(pedido) {
  // Monta o texto com informações do cliente e pedido
  let texto = `Cliente: ${pedido.nomeCliente} <br>`;
  let mesa = `Mesa: ${pedido.mesa}<br>`;
  let itens = `Pedido: ${pedido.titulo}`;
  texto += mesa + itens;

  // Abre uma nova janela para impressão
  const win = window.open("", "", "width=800,height=600");

  if (win) {
    // Monta o documento HTML para impressão
    win.document.write("<html><head><title>Pedido</title>");
    win.document.write("</head><body>");
    win.document.write(texto);
    win.document.write("</body></html>");

    // Fecha o documento (necessário para o funcionamento correto no IE >= 10)
    win.document.close();

    // Foca na nova janela (necessário para o IE >= 10)
    win.focus();

    // Atualiza o status do pedido para "em andamento"
    PUTPedidoCozinha(pedido.id, 2);

    // Dispara a impressão após um curto intervalo
    setTimeout(function () {
      win.print(); // Imprime o documento
      win.close(); // Fecha a janela após a impressão
    }, 1000);
  }
}

/**
 * Exibe o modal com detalhes do pedido
 * @param {Object} pedido - Detalhes do pedido
 * @param {HTMLElement} pedidoElement - Elemento do pedido na interface
 */
function exibirDetalhesModal(pedido, pedidoElement) {
  // Verifica o status atual do pedido
  const status = pedidoElement.getAttribute("data-id");

  // Determina o status do pedido (pendente ou finalizado) com base no valor de status
  const pendente = status == 1; // Se o status for 1, é pendente
  const finalizado = status == 3; // Se o status for 3, é finalizado

  // Insere o HTML do modal no documento, passando as variáveis pendente e finalizado
  const html = montarModal(pendente, finalizado);
  document.body.insertAdjacentHTML("beforeend", html);
  const modal = document.getElementById("pedidoModal");
  const closeBtn = document.querySelector(".close-modal");

  // Configura evento para fechar o modal ao clicar no botão de fechar
  closeBtn.onclick = function () {
    modal.remove();
  };

  // Configura evento para fechar o modal ao clicar fora
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.remove();
    }
  };

  // Preenche os detalhes do pedido no modal
  document.getElementById("modalTitulo").textContent = "🍔 " + pedido.titulo;
  document.getElementById("modalmesa").textContent =
    "Mesa: " + pedido.numeroMesa;
  document.getElementById("modalnomeCliente").textContent =
    "Cliente: " + pedido.nomeCliente;

  // Configura botão de impressão (se disponível)
  const btnPrint = document.querySelector("#print");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      imprimir({ ...pedido, mesa: pedido.numeroMesa });
    });
  }

  // Configura botão de remover (se disponível)
  const btnEntregado = document.querySelector("#entregue");
  if (btnEntregado) {
    btnEntregado.addEventListener("click", () => {
      // Atualiza o status do pedido para "entregue" (status 4)
      PUTPedidoCozinha(pedido.id, 4);
      // Remove o modal da interface
      modal.remove();
    });
  }
}

//////////////////////////////////////////////////////// aqui começa algo \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

function pegarInfoUsuarioLocalStorage() {
  let usuarioInfo = localStorage.getItem("usuarioInfo");
  usuarioInfo = JSON.parse(usuarioInfo);
  return usuarioInfo;
}

function mudarNomeDoUsuario(usuarioInfo) {
  let usuarioP = document.getElementById("p-username");
  usuarioP.innerHTML = usuarioInfo.username;
}

document.addEventListener("DOMContentLoaded", function () {
  // Verificar se o usuário está logado
  const usuarioInfo = localStorage.getItem("usuarioInfo");

  if (!usuarioInfo) {
    exibirModalLogin();
  } else {
    chamarPrimeirasFuncoes();
  }
});

// Função para exibir o modal
function exibirModalLogin() {
  // Inserir o modal no HTML
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    ">
      <div style="
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      ">
        <p style="margin: 0 0 10px;">Você não está logado. Por favor, faça login para acessar o sistema.</p>
        <button id="botao-login" style="
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #007BFF;
          color: white;
          cursor: pointer;
        ">Ir para o Login</button>
      </div>
    </div>
    `
  );

  // Adicionar evento ao botão de login
  const botaoLogin = document.getElementById("botao-login");
  botaoLogin.addEventListener("click", () => {
    window.location.href = "../login/index.html";
  });
}
