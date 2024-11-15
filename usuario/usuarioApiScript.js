const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function GETUsuarios() {
  try {
    let response = await fetch(
      "https://comandaapilobo.somee.com/api/Usuarios",
      {
        method: "GET",
        headers: header,
      }
    );
    let result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function POSTUsuario(valoresUsuario) {
  try {
    let response = await fetch(
      `https://comandaapilobo.somee.com/api/Usuarios`,
      {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          nomeUsuario: valoresUsuario[0].value,
          emailUsuario: valoresUsuario[1].value,
          senhaUsuario: valoresUsuario[2].value,
          idFuncaoUsuario: 0,
        }),
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function DELETEUsuario(idUsuario) {
  try {
    let response = await fetch(
      `https://comandaapilobo.somee.com/api/Usuarios/${idUsuario}`,
      {
        method: "DELETE",
        headers: header,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function PUTUsuario(valoresUsuario, idItem) {
  try {
    let response = await fetch(
      `https://comandaapilobo.somee.com/api/Usuarios/${idItem}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify({
          idUsuario: idItem,
          nomeUsuario: valoresUsuario[0].value,
          emailUsuario: valoresUsuario[1].value,
          senhaUsuario: valoresUsuario[2].value,
          idFuncaoUsuario: 0,
        }),
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function GETUsuario(idItem) {
  let response = await fetch(
    `https://comandaapilobo.somee.com/api/Usuarios/${idItem}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  return result;
}

export { GETUsuarios, POSTUsuario, DELETEUsuario, PUTUsuario, GETUsuario };
