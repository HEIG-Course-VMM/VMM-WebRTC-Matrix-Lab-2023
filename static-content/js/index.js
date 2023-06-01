const token = localStorage.getItem("token");
if (token == null) {
  window.location.href = "/login.html";
}else {
  window.location.href = "/home.html";
}
