function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const allUsers = JSON.parse(localStorage.getItem('users')) || [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "supervisor", password: "sup123", role: "supervisor" },
    { username: "vendedor", password: "vend123", role: "vendedor" }
  ];

  localStorage.setItem('users', JSON.stringify(allUsers));

  const user = allUsers.find(u => u.username === username && u.password === password);

  if(user){
    localStorage.setItem("loggedUser", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    document.getElementById('error-msg').textContent = "Usuário ou senha incorretos!";
  }
}
