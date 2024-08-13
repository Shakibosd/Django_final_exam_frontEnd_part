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
//order
function orderFlower(flower) {
  const userId = localStorage.getItem("user_id");
  const button = document.getElementById("order_submit");

  button.addEventListener("click", () => {
    const input = document.getElementById("quantity");
    const productQuantity = parseInt(input.value);

    if (!userId) {
      alert("You need to be logged in to place an order");
      return;
    }

    if (productQuantity <= flower.stock) {
      fetch("https://django-final-exam-backend-part.onrender.com/orders/create_order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          product_id: flower.id,
          quantity: productQuantity,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          alert("Order placed successfully!");
          window.location.href = "./update_profile.html";
        })
        .catch(() => {
          alert("Error placing order");
          window.location.href = "./update_profile.html";
        });
    } else {
      alert("Insufficient stock");
    }
  });
}
//desplay flower detail
function displayFlowerDetails(flower) {
  const detailsContainer = document.getElementById("flower-details");
  detailsContainer.innerHTML = `
    <div class="card container bg-white text-dark index_flower_card" style="border-radius: 10px;">
        <br/>
        <img src="${flower.image}" class="card-img-top mx-auto d-block" alt="${flower.title}" style="width:800px; height:500px; border-radius: 10px;">
        <h1 class="pt-5">${flower.title}</h1>
        <p>Price : ${flower.price} ৳</p>
        <p>Category : <span class="btn btn-secondary">${flower.category}</span></p>
        <p>Stock : ${flower.stock}</p>
        <p>Description : ${flower.description}</p>
        <div class="d-flex gap-3">
            <a href="./profile.html" class="btn btn-success text-white">Back To Profile</a>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderModal">Order Now</button>
            <button class="btn btn-warning" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample">Comment</button>
        </div>
        <br/>
        <div class="collapse" id="collapseExample">
            <div class="card-body">
                <section class="container w-75">
                    <div class="comment-section container w-75 card bg-white index_flower_card" style="border-radius: 10px;">
                        <div id="commentForm" class="row g-3 mx-auto w-100 gap-3" style="padding-top: 30px">
                            <div class="col-md-12">
                                <label for="name" class="form-label"><b>Name</b></label>
                                <input type="text" class="form-control" id="name" name="name" required />
                            </div>
                            <div class="col-md-12">
                                <label for="text" class="form-label"><b>Messages</b></label>
                                <textarea class="form-control" id="text" name="text" required></textarea>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-outline-info" id="submit_buttons">Submit</button>
                            </div>
                          <br/>
                        </div>
                    </div>
                </section>
              <br/>
            </div>
        </div>
    </div>
    <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="width:600px; height:220px;">
                <button type="button" class="btn-close text-white" data-bs-dismiss="modal" aria-label="Close" style="padding-left:1150px;"></button>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="quantity" class="form-label text-dark"><b>Quantity</b></label>
                        <input id="quantity" type="number" class="form-control">
                    </div>
                    <button type="button" class="btn btn-primary pl-5" id="order_submit">Submit</button>
                </div>
            </div>
        </div>
    </div>
  `;
  orderFlower(flower);
  postComment(flower.id);
  getComments(flower.id);
}
//post comment
const postComment = (flowerId) => {
  const commentButton = document.getElementById("submit_buttons");
  if (!commentButton) {
    console.error("Submit button not found");
    return;
  }
  commentButton.addEventListener("click", (event) => {
    event.preventDefault();
    location.reload();

    const username = document.getElementById("name").value;
    const userText = document.getElementById("text").value;

    fetch("https://django-final-exam-backend-part.onrender.com/flowers/comments_api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flowerId: flowerId,
        names: username,
        comment: userText,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not o k");
        }
        return res.json();
      })
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  });
};

// get comment
const getComments = (flowerId) => {
  fetch(`https://django-final-exam-backend-part.onrender.com/flowers/get_comment/${flowerId}/`)
    .then((res) => res.json())
    .then((data) => {
      displayComment(data);
    });
};
// display comment
const displayComment = (comments) => {
  const commentCount = document.getElementById("comments-count");
  const commentDiv = document.getElementById("comments-list");

  commentCount.innerHTML = `${comments.length}`;

  let commentsHtml = comments.map(comment => `
    <div class="bg-white text-dark card p-4 mb-3 w-25 index_flower_card" style="border-radius: 10px;">
      <h6>${comment.name}</h6> 
      <p>${comment.body}</p>
      <small>${new Date(comment.created_on).toLocaleString()}</small>
      <br/>
      <div class="d-flex gap-5">
        <button class="btn btn-success edit-comment" data-id="${comment.id}" data-name="${comment.name}" data-body="${comment.body}">Edit</button>
        <button class="btn btn-danger delete-comment" data-id="${comment.id}">Delete</button>
      </div>   
    </div>
  `).join('');
  commentDiv.innerHTML = commentsHtml;
};

// comment edit
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
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
    location.reload();
    const commentId = document.getElementById("edit-comment-id").value;
    const commentName = document.getElementById("edit-comment-name").value;
    const commentBody = document.getElementById("edit-comment-body").value;

    try {
      const response = await fetch(`https://django-final-exam-backend-part.onrender.com/flowers/comments/${commentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ name: commentName, body: commentBody })
      });

      if (response.ok) {
        const updatedComments = await getComments();
        displayComment(updatedComments);
        document.getElementById("edit-comment-form").style.display = "none";
      } else {
        const errorData = await response.json();
        alert(`Failed to update comment: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  });

  // comment delete
  document.getElementById("comments-list").addEventListener("click", async (event) => {
    const token = localStorage.getItem("authToken");
    if (event.target.classList.contains("delete-comment")) {
      const commentId = event.target.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this comment?")) {
        location.reload();  
        try {
          const response = await fetch(`https://django-final-exam-backend-part.onrender.com/flowers/comments/${commentId}/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
          });

          if (response.ok) {
            const updatedComments = await getComments();
            displayComment(updatedComments);
          } else {
            alert("Failed to delete comment.");
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      }
    }
  });
});
