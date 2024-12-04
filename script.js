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

chamarPrimeirasFuncoes();
