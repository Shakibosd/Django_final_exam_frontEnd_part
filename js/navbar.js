fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    //Assign Auth Element
    const navElement = document.getElementById("nav-element");
    const token = localStorage.getItem("authToken");

    console.log(token);

    if (token) {
      navElement.innerHTML += ` 
          <a href="./profile.html" class="btn btn-outline-success">Home</a>
          <a class="btn btn-outline-primary" href="./update_profile.html">Profile</a>
          <a href="./pass_change.html" class="btn btn-outline-warning">Password Change</a>
           <a href="http://127.0.0.1:8000/admin/" class="btn btn-outline-secondary">Admin Dashboard</a>
          <a class="btn btn-danger" onclick="handleLogout()">Logout</a>
        `;

    }
    else {
      navElement.innerHTML += `
        <a href="./index.html" class="btn btn-outline-info">Home</a>
        <a href="./register.html" class="btn btn-outline-warning">SignUp</a>
        <a href="./login.html" class="btn btn-outline-primary">Login</a>
      `;
    }
  });