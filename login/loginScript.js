import { GETUsuario } from "../usuario/usuarioApiScript";

function adicionarEventoCliqueMostrarSenha() {
  const mostrarSenhaSvg = document.querySelector(".olho-icon");
  mostrarSenhaSvg.addEventListener("click", () => {
    trocarTipoDoCampoSenha(mostrarSenhaSvg);
  });
}

function trocarTipoDoCampoSenha(mostrarSenhaSvg) {
  const inputSenha = document.querySelector("#input-senha");
  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    mostrarSenhaSvg.src = "../imgs/olho.png";
  } else {
    inputSenha.type = "password";
    mostrarSenhaSvg.src = "../imgs/olho-slash.png";
  }
}

function adicionarEventoForm() {
  let form = document.querySelector("form");
  form.addEventListener("submit", () => {
    const usuarioInfo = GET;
  });
}

adicionarEventoCliqueMostrarSenha();
