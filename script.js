function adicionarEventoCliqueLiCardapio() {
  const liCardapio = document.querySelector("#li-cardapio");
  liCardapio.addEventListener("click", () => {
    window.location.href = "/cardapio/index.html";
  });
}

adicionarEventoCliqueLiCardapio();
