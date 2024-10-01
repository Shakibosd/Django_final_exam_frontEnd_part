const loadFlowers = () => {
  fetch("http://127.0.0.1:8000/flowers/flowers/")
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => displayFlowers(data))
    .catch((error) => {
      console.error('Fetch error:', error);
      const parent = document.getElementById("flower-container");
      parent.innerHTML = `<p class="text-danger">Failed to load flowers. Please try again later.</p>`;
    });
};

const displayFlowers = (flowers) => {
  const parent = document.getElementById("flower-container");
  parent.innerHTML = ''; 
  flowers.forEach((flower) => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4"; 
    card.innerHTML = `
      <div class="card bg-white text-dark pt-3 index_flower_card" style="border-radius: 15px;">
        <img src="${flower.image}" class="card-img-top mx-auto d-block" alt="${flower.title}" style="width:70%; height:210px; border-radius:10px;">
        <div class="card-body" style="height:230px;">
          <h6 class="card-title">Title: ${flower.title}</h6>
          <p>Price: ${flower.price} ৳</p>
          <small>Category:</small> <small class="btn btn-secondary btn-sm">${flower.category}</small>
          <p class="card-text">Description: ${flower.description.slice(0, 20)}...</p>
        </div>
      </div>
    `;
    parent.appendChild(card);
  });
};

loadFlowers();


