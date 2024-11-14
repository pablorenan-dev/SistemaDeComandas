import { GETUsuarios } from "../usuario/usuarioApiScript.js";

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

async function adicionarEventoForm() {
  let form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    let nomeUsuarioInput = document.querySelectorAll("input");
    event.preventDefault();
    const usuarioInfo = await GETUsuarios();
    console.log(usuarioInfo);

    let usuario = usuarioInfo.find(
      (user) =>
        user.emailUsuario === nomeUsuarioInput[0].value &&
        user.senhaUsuario === nomeUsuarioInput[1].value
    );

    if (usuario) {
      alert(`Login bem-sucedido! Bem-vindo, ${usuario.nomeUsuario}`);
      window.location.href = "../index.html";
    } else {
      alert("Nome de usuário ou senha incorretos.");
    }
  });
}

adicionarEventoForm();
adicionarEventoCliqueMostrarSenha();
