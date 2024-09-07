//flower filter
document.addEventListener("DOMContentLoaded", () => {
  const filterList = document.getElementById("filter-list");
  const flowerContainer = document.getElementById("flower-container");

  fetchFlowers("all");

  filterList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const filter = e.target.getAttribute("data-filter");
      fetchFlowers(filter);
    }
  });

  function fetchFlowers(filter) {
    fetch("http://127.0.0.1:8000/flowers/flowers/")
      .then((res) => res.json())
      .then((data) => {
        let filteredFlowers = data;
        if (filter !== "all") {
          filteredFlowers = data.filter((flower) => flower.category === filter);
        }
        displayFlowers(filteredFlowers);
      })
      .catch((error) => console.error("Error fetching flowers:", error));
  }

  //flower detail daynamic
  function displayFlowers(flowers) {
    flowerContainer.innerHTML = "";
    flowers.forEach((flower) => {
      const flowerCard = document.createElement("div");
      flowerCard.style.width = "21rem";

      flowerCard.innerHTML = `
       <div class="card bg-white text-dark pt-3 index_flower_card" style="width:350px; border-radius:15px;">
          <img src="${flower.image}" class="card-img-top mx-auto d-block" alt="${flower.title}" style="width:280px; height:210px; border-radius:10px;">
          <div class="card-body" style="height:245px;">
              <h6 class="card-title">Title : ${flower.title}</h6>
              <p>Price : ${flower.price} ৳</p>
              Category : <small class="btn btn-secondary btn-sm"> ${flower.category}</small>
              <p>Stock : ${flower.stock}</p>
              <p class="card-text">Description: ${flower.description.slice(0, 20)}...</p>
              <a class="btn btn-primary btn-sm w-25" href="./flower_details.html?id=${flower.id}">Details</a>
          </div>
        </div>
      `;

      flowerContainer.appendChild(flowerCard);
    });

    const flowerCountElement = document.getElementById("flower-count");
    flowerCountElement.innerText = `Total Flowers: ${flowers.length} !`;
  }
});

// Animation area
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};