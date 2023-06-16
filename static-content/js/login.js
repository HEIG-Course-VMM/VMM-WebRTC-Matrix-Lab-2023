const BASE_URL = "http://localhost:8008";

function onSubmit() {
  (async () => {
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    console.log(JSON.stringify(login) + " " + JSON.stringify(password));
    try {
      const client = matrixcs.createClient({ baseUrl: BASE_URL });
      let token = await client.login("m.login.password", {
        user: login,
        password: password,
      });
      localStorage.setItem("token", JSON.stringify(token));
      window.location.href = "/index.html";
      console.log(JSON.stringify(token));
    } catch (e) {
      console.log("ça marche pas !!");
    }
  })();

  return false;
}
