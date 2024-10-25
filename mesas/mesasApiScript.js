const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function GETMesas() {
  try {
    let response = await fetch("http://localhost:5164/api/Mesas", {
      method: "GET",
      headers: header,
    });
    let result = await response.json();
    return result;
  } catch (error) {
    console.log(error, "EROOOOOOOO!");
  }
}

export { GETMesas };
