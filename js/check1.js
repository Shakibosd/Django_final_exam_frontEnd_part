const checks1 = () => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    window.location.href = "./update_profile.html";
  }
};

window.onload = checks1;
