function adicionarEventoCliqueLiCardapio() {
  const liCardapio = document.querySelector("#li-cardapio");
  liCardapio.addEventListener("click", () => {
    window.location.href = "/cardapio/index.html";
  });
}

adicionarEventoCliqueLiCardapio();

function adicionarEventoCliqueLiPedidoCozinha() {
  const liCardapio = document.querySelector("#li-pedido");
  liCardapio.addEventListener("click", () => {
    window.location.href = "/pedidoCozinha/index.html";
  });
}

adicionarEventoCliqueLiPedidoCozinha();

function adicionarEventoCliqueLiComanda() {
  const liCardapio = document.querySelector("#li-comanda");
  liCardapio.addEventListener("click", () => {
    window.location.href = "/Comanda/index.html";
  });
}

adicionarEventoCliqueLiComanda();

function adicionarEventoCliqueLiUsuarios() {
  const liCardapio = document.querySelector("#li-usuarios");
  liCardapio.addEventListener("click", () => {
    window.location.href = "/usuario/index.html";
  });
}

adicionarEventoCliqueLiUsuarios();

function adicionarEventoCliqueLiMesas() {
  const liCardapio = document.querySelector("#li-mesas");
  liCardapio.addEventListener("click", () => {
    // para arrumar passar /SistemaDeComandas/
    window.location.href = "mesas/index.html";
  });
}

adicionarEventoCliqueLiMesas();
