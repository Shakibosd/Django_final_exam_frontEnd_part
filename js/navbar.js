//navbar all page
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
      <a href="./profile.html" class="btn btn-outline-success btn-sm" style="padding-top:7px;">Home</a>
      <a class="btn btn-outline-primary btn-sm" href="./update_profile.html"><i style="font-size: 20px; font-weight:bold; padding-top:5px; color:#ffffff;" class='bx bx-user'></i></a>
      <a href="./pass_change.html" class="btn btn-outline-secondary"><i class='bx bxs-parking' style="color:#ffffff;"></i></a>
      <a class="btn btn-danger btn-sm" style="padding-top:7px;" onclick="handleLogout()">Logout</a>
      `;
    } else {
      navElement.innerHTML += `
      <a href="./index.html" class="btn btn-outline-info btn-sm">Home</a>
      <a href="./register.html" class="btn btn-outline-warning btn-sm">SignUp</a>
      <a href="./login.html" class="btn btn-outline-primary btn-sm">Login</a>
      `;
    }
  });
