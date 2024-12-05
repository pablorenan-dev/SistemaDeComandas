function adicionarEventoCliqueLiCardapio() {
  const liCardapio = document.querySelector("#li-cardapio");
  liCardapio.addEventListener("click", () => {
    window.location.href = "cardapio/index.html";
  });
}

function adicionarEventoCliqueLiPedidoCozinha() {
  const liCardapio = document.querySelector("#li-pedido");
  liCardapio.addEventListener("click", () => {
    window.location.href = "pedidoCozinha/index.html";
  });
}

function adicionarEventoCliqueLiComanda() {
  const liCardapio = document.querySelector("#li-comanda");
  liCardapio.addEventListener("click", () => {
    window.location.href = "Comanda/index.html";
  });
}

function adicionarEventoCliqueLiUsuarios() {
  const liCardapio = document.querySelector("#li-usuarios");
  liCardapio.addEventListener("click", () => {
    window.location.href = "usuario/index.html";
  });
}

function adicionarEventoCliqueLiMesas() {
  const liCardapio = document.querySelector("#li-mesas");
  liCardapio.addEventListener("click", () => {
    // para arrumar passar /SistemaDeComandas/
    window.location.href = "mesas/index.html";
  });
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
});

function mudarNomeDoUsuario(usuarioInfo) {
  let usuarioP = document.getElementById("p-username");
  usuarioP.innerHTML = usuarioInfo.username;
}

function pegarInfoUsuarioLocalStorage() {
  let usuarioInfo = localStorage.getItem("usuarioInfo");
  usuarioInfo = JSON.parse(usuarioInfo);
  return usuarioInfo;
}

function removerCamposDaTelaParaUsuarioNaoAdmin() {
  let camposTela = document.querySelectorAll("li");
  camposTela[4].remove();
}

function chamarPrimeirasFuncoes() {
  let usuarioInfo = pegarInfoUsuarioLocalStorage();
  if (usuarioInfo.userId === 1) {
    adicionarEventoCliqueLiUsuarios();
  } else {
    removerCamposDaTelaParaUsuarioNaoAdmin();
  }
  adicionarEventoCliqueLiMesas();
  adicionarEventoCliqueLiComanda();
  adicionarEventoCliqueLiCardapio();
  adicionarEventoCliqueLiPedidoCozinha();
  mudarNomeDoUsuario(usuarioInfo);
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
    window.location.href = "login/index.html";
  });
}
