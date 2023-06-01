const BASE_URL = "http://localhost:8008";

function onSubmit() {
  (async () => {
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    console.log(JSON.stringify(login) + " " + JSON.stringify(password));

    const client = matrixcs.createClient({ baseUrl: BASE_URL });
    let token = await client.login("m.login.password", {
      user: login,
      password: password,
    });

    console.log(JSON.stringify(token));
  })();

  return false;
}
