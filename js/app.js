// flowers api fetch
const loadFlowers = () => {
  fetch("https://django-final-exam-backend-part.onrender.com/flowers/flowers/")
    .then((response) => response.json())
    .then((data) => displayFlowers(data))
    .catch((error) => console.log(error));
};

// flowers dynamic
const displayFlowers = (flowers) => {
  flowers.forEach((flower) => {
    const parent = document.getElementById("flower-container");
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="card bg-white text-dark pt-3 index_flower_card" style="width:350px; border-radius: 15px;">
          <img src="${flower.image}" class="card-img-top mx-auto d-block" alt="${flower.title}" style="width:280px; height:210px; border-radius:10px;">
          <div class="card-body" style="height:230px;">
              <h6 class="card-title">Title: ${flower.title}</h6>
              <br>
              <p>Price: ${flower.price} ৳</p>
              <small>Category : </small> <small class="btn btn-secondary btn-sm">${flower.category}</small>
              <br>
              <br>
              <p class="card-text">Description: ${flower.description.slice(0, 20)}...</p>
          </div>
        </div>
      `;
    parent.appendChild(card);
  });
};

loadFlowers();

// Animation area
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};

