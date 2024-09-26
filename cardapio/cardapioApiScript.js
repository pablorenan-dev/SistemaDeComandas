const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function GETItensCardapio() {
  try {
    let response = await fetch("http://localhost:5164/api/CardapioItems", {
      method: "GET",
      headers: header,
    });
    let result = await response.json();
    return result;
  } catch (error) {
    console.log(error, "EROOOOOOOO!");
  }
}

async function PUTItemCardapio(valoresItem, idItem) {
  let valoresInputs = valoresItem[0];
  let valorCheckbox = valoresItem[1];

  try {
    let response = await fetch(
      `http://localhost:5164/api/CardapioItems/${idItem}`,
      {
        method: "PUT",
        headers: header,
        body: JSON.stringify({
          id: idItem,
          titulo: valoresInputs[0].value,
          descricao: valoresInputs[1].value,
          preco: parseFloat(valoresInputs[2].value),
          possuiPreparo: valorCheckbox.checked,
        }),
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function DELETEItenCardapio(idItem) {
  try {
    let response = await fetch(
      `http://localhost:5164/api/CardapioItems/${idItem}`,
      {
        method: "DELETE",
        headers: header,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function GETItemCardapio(idItem) {
  let response = await fetch(
    `http://localhost:5164/api/CardapioItems/${idItem}`,
    {
      method: "GET",
      headers: header,
    }
  );
  let result = await response.json();
  return result;
}

async function POSTItemCardapio(valoresItem) {
  let valoresInputs = valoresItem[0];
  let valorCheckbox = valoresItem[1];

  try {
    let response = await fetch("http://localhost:5164/api/CardapioItems", {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        titulo: valoresInputs[0].value,
        descricao: valoresInputs[1].value,
        preco: parseFloat(valoresInputs[2].value),
        possuiPreparo: valorCheckbox.checked,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  DELETEItenCardapio,
  GETItemCardapio,
  GETItensCardapio,
  POSTItemCardapio,
  PUTItemCardapio,
};
