const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function GETMesas() {
  try {
    let response = await fetch("http://comandaapilobo.somee.com/api/Mesas", {
      method: "GET",
      headers: header,
    });
    let result = await response.json();
    return result;
  } catch (error) {
    console.log(error, "EROOOOOOOO!");
  }
}

async function DELETEMesa(IdMesa) {
  try {
    let response = await fetch(
      `http://comandaapilobo.somee.com/api/Mesas/${IdMesa}`,
      {
        method: "DELETE",
        headers: header,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function POSTMesa(valoresMesa) {
  try {
    let response = await fetch(`http://comandaapilobo.somee.com/api/Mesas`, {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        numeroMesa: valoresMesa[0],
        situacaoMesa: valoresMesa[1],
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

async function GETMesa(idItem) {
  let response = await fetch(
    `http://comandaapilobo.somee.com/api/Mesas/${idItem}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  return result;
}

async function PUTMesa(valoresMesa, idItem) {
  try {
    let response = await fetch(
      `http://comandaapilobo.somee.com/api/Mesas/${idItem}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify({
          idMesa: idItem,
          numeroMesa: valoresMesa[0],
          situacaoMesa: valoresMesa[1],
        }),
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export { GETMesas, DELETEMesa, POSTMesa, GETMesa, PUTMesa };
