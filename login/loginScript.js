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
      window.location.href = "../index.html";
    } else {
      montarModalErro();
    }
  });
}

// Adicionar um evento de clique no botao de fechar o modal(o x no canto superior direito do modal)
function adicionarEventoCliqueBotaoFecharModal() {
  const buttonClose = document.querySelector(".modal-button");
  buttonClose.addEventListener("click", () => {
    let nomeUsuarioInput = document.querySelectorAll("input");
    nomeUsuarioInput[0].value = "";
    nomeUsuarioInput[1].value = "";
    removerModal();
  });
}

function montarModalErro() {
  const body = document.body;
  body.insertAdjacentHTML(
    "beforeend",
    `
     <div class="modal-wrapper">
      <div class="modal">
        <div class="modal-header" style="background-color: var(--color-red);">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            fill="currentColor"
            class="bi bi-file-x"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708"
            />
            <path
              d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"
            />
          </svg>
          <h2>Email ou senha incorretos</h2>
          <button class="modal-button">X</button>
        </div>
        <div class="modal-body">
          <div>
            <button class="button-adicionar-item-modal" id="button-deletar-item">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
    `
  );
  adicionarEventoCliqueBotaoFecharModal();
  adicionarEventoCliqueBotaoConfirmarModal();
}

function adicionarEventoCliqueBotaoConfirmarModal() {
  const buttonClose = document.querySelector(".button-adicionar-item-modal");
  buttonClose.addEventListener("click", () => {
    let nomeUsuarioInput = document.querySelectorAll("input");
    nomeUsuarioInput[0].value = "";
    nomeUsuarioInput[1].value = "";
    removerModal();
  });
}

// Remove o modal por completo da tela
function removerModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.remove();
}

adicionarEventoForm();
adicionarEventoCliqueMostrarSenha();
