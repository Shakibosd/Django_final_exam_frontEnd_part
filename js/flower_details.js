//flower details api fetch
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const flowerId = urlParams.get("id");

  fetch(`https://django-final-exam-backend-part.onrender.com/flowers/flowers/${flowerId}/`)
    .then((response) => response.json())
    .then((data) => {
      displayFlowerDetails(data);
    })
    .catch((error) => console.error("Error fetching flower details:", error));
});

function order_flower(flower) {
  const userId = localStorage.getItem("user_id");
  const button = document.getElementById("order_submit");

  button.addEventListener("click", () => {
    const input = document.getElementById("quantity");
    const product_quantity = parseInt(input.value);

    if (!userId) {
      console.log("User not logged in");
      alert("You need to be logged in to place an order");
      return;
    }

    if (product_quantity <= flower.stock) {
      fetch("https://django-final-exam-backend-part.onrender.com/orders/create_order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          product_id: flower.id,
          quantity: product_quantity,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("Order placed successfully:", response);
          alert("Order placed successfully!");
          window.location.href = "./update_profile.html";
        })
        .catch((error) => {
          console.log("Order error", error);
          alert("Error placing order");
          window.location.href = "./update_profile.html";
        });
    } else {
      console.log("Insufficient stock");
      alert("Insufficient stock");
    }
  });
}

//flower details dynamic
function displayFlowerDetails(flower) {
  const detailsContainer = document.getElementById("flower-details");
  detailsContainer.innerHTML = `
        <div class="card container bg-white text-dark index_flower_card" style="border-radius: 10px;">
            <br>
            <img src="${flower.image}" class="card-img-top mx-auto d-block" alt="${flower.title}" style="width:800px; height:500px; border-radius: 10px;">
            <h1 class="pt-5">${flower.title}</h1>
            <p>Price : ${flower.price} ৳</p>
            <p>Category : <span class="btn btn-secondary">${flower.category}</span></p>
            <p>Stock : ${flower.stock}</p>
            <p>Description : ${flower.description}</p>   
            <br>
            <div class="d-flex gap-3">
                <div>
                    <a href="./profile.html" class="btn btn-success text-white">Back To Profile</a>
                </div>
               <div>
                  <!-- Button trigger modal -->
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderModal">
                    Order Now
                  </button>
                  <!-- Modal -->
                  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content" style="width:600px; height:220px;">
                        <div class="">
                          <button type="button" class="btn-close text-white" data-bs-dismiss="modal" aria-label="Close" style="padding-left:1150px;"></button>
                        </div>
                        <div class="modal-body">
                          <div class="mb-3">
                              <label for="quantity" class="form-label text-dark"><b>Quantity</b></label>
                              <input id="quantity" type="number" class="form-control bg-secondary">
                          </div>
                          <button type="button" class="btn btn-primary pl-5" id="order_submit">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <br>
        </div>
    `;
  order_flower(flower);
  post_comment(flower.id);
  get_comments(flower.id);
  checkPurchaseStatus(flower.id);
}

//comment part  
const post_comment = (flowerId) => {
  const comment_button = document.getElementById("submit_buttons");
  comment_button.addEventListener("click", () => {
    location.reload();
    const username = document.getElementById("name").value;
    const usertext = document.getElementById("text").value;
    fetch("https://django-final-exam-backend-part.onrender.com/flowers/comments_api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flowerId: flowerId,
        names: username,
        comment: usertext,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("network response waz not ok");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(flowerId, username, usertext);
  });
};

const get_comments = (flowerId) => {
  fetch(`https://django-final-exam-backend-part.onrender.com/flowers/get_comment/${flowerId}/`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayComment(data);
    });
};

//comment display
const displayComment = (comments) => {
  console.log(comments);
  const commentCount = document.getElementById("comments-count");
  const commentdiv = document.getElementById("comments-list");

  commentCount.innerHTML = `${comments.length}`;

  let commentsHtml = comments.map(comment => `
  <div id="comments-list">
    <div class="bg-white text-dark card p-4 mb-3 w-25 index_flower_card" style="border-radius: 10px;">
      <h4>${comment.name}</h4>
      <p>${comment.body}</p>
      <small>${new Date(comment.created_on).toLocaleString()}</small>
      <br>
      <div class="d-flex gap-5">
        <div>
        <a class="btn btn-success edit-comment" data-id="${comment.id}" data-name="${comment.name}" data-body="${comment.body}">Edit</a>
        </div>
        <div>
          <a class="btn btn-danger delete-comment" data-id="${comment.id}">Delete</a>
        </div>
      </div>
    </div>
  </div>
  `).join('');
  commentdiv.innerHTML = commentsHtml;
};

const checkPurchaseStatus = (flowerId) => {
  const token = localStorage.getItem("authToken");
  fetch(`https://django-final-exam-backend-part.onrender.com/flowers/check_purchase/${flowerId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.has_purchased) {
        document.getElementById("commentForm").style.display = "block";
      } else {
        document.getElementById("commentForm").style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error checking purchase status:", error);
    });
};


//handle edit comment
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("comments-list").addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-comment")) {
      const commentId = event.target.getAttribute("data-id");
      const commentName = event.target.getAttribute("data-name");
      const commentBody = event.target.getAttribute("data-body");

      document.getElementById("edit-comment-id").value = commentId;
      document.getElementById("edit-comment-name").value = commentName;
      document.getElementById("edit-comment-body").value = commentBody;
      document.getElementById("edit-comment-form").style.display = "block";
    }
  });

  document.getElementById("edit-comment-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const commentId = document.getElementById("edit-comment-id").value;
    const commentName = document.getElementById("edit-comment-name").value;
    const commentBody = document.getElementById("edit-comment-body").value;

    try {
      const response = await fetch(`https://django-final-exam-backend-part.onrender.com/flowers/comments/${commentId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ name: commentName, body: commentBody })
      });

      if (response.ok) {
        document.getElementById("edit-comment-form").style.display = "none";
        const updatedComments = await get_comments();
        displayComment(updatedComments);
      } else {
        const errorData = await response.json();
        console.error("Failed to update comment: ", errorData);
        alert(`Failed to update comment: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occurred while updating the comment");
    }
  });
});

// Handle delete comment
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("comments-list").addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-comment")) {
      const commentId = event.target.getAttribute("data-id");
      try {
        if (confirm("Are you sure you want to delete this comment?")) {
          const response = await fetch(`https://django-final-exam-backend-part.onrender.com/flowers/comments/${commentId}/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${localStorage.getItem("authToken")}`
            }
          });

          if (response.ok) {
            const commentElement = event.target.closest(".card");
            commentElement.remove();
            window.location.reload();
            const updatedComments = await get_comments();
            displayComment(updatedComments);
          } else {
            alert("Failed to delete comment");
          }
        }
      } catch (error) {
        console.error("Error: ", error);
        alert("An error occurred while deleting the comment");
      }
    }
  });
});

