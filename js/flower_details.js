//flower details api fetch
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const flowerId = urlParams.get("id");

  fetch(`https://flower-seal.vercel.app/flowers/flowers/${flowerId}/`)
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
      fetch("https://flower-seal.vercel.app/orders/create_order/", {
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
        <div class="card container bg-white text-dark index_flower_card" style="border-radius: 20px;">
            <br>
            <img src="${flower.image}" class="img-fluid mx-auto d-block" alt="${flower.title}" style="width:800px; height:500px; border-radius: 10px;">
            <h1 class="pt-5">${flower.title}</h1>
            <p>Price : ${flower.price} ৳</p>
            <p>Category : <span class="btn btn-secondary">${flower.category}</span></p>
            <p>Stock : ${flower.stock}</p>
            <p>Description : ${flower.description}</p>   
            <br>
                 <div class="row g-2">
                <div class="col-12">
                    <a href="./profile.html" class="btn btn-success text-white w-100">Back To Profile</a>
                </div>
                <div class="col-12">
                    <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#orderModal">
                      Order Now
                    </button>
                </div>
                <div class="col-12">
                    <button class="btn btn-warning w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                      Comment
                    </button>
                </div>
              </div>
            <div class="d-flex gap-3">
                <div>
                    
                </div>
               <div>
                  <!-- Button trigger modal -->
                  <div class="d-flex gap-3">
                     <div>
                   
                     </div>
                         <div>
                            <p>
                            
                             </p>
                          <div class="collapse" id="collapseExample">
                            <div class="card-body">
                                <section>
                                <div class="comment-section container card bg-white index_flower_card" id="index_flower_card"
                                  style="border-radius: 10px;">
                                  <div id="commentForm" class="row g-3" style="padding-top: 30px;">
                                    <div class="col-md-12">
                                      <label for="name" class="form-label"><b>Name</b></label>
                                      <input type="text" class="form-control" id="name" name="name" required />
                                    </div>
                                    <div class="col-md-12">
                                      <label for="text" class="form-label"><b>Messages</b></label>
                                      <textarea class="form-control" id="text" name="text" required></textarea>
                                    </div>
                                    <div class="col-12">
                                      <button type="submit" class="btn btn-outline-info" id="submit_buttons">
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                     <br />
                                </div>
                              </section>
                            </div>
                          </div>
                     </div>
                  </div>
                  <!-- Modal -->
                  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content p-3">
                        <div>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="padding-left:55rem;"></button>
                        </div>
                        <div class="modal-body">
                          <div class="mb-3">
                              <label for="quantity" class="form-label"><b>Quantity</b></label>
                              <input id="quantity" type="number" class="form-control"  placeholder="Please A Quantity" required />
                          </div>
                          <button type="submit" class="btn btn-primary" id="order_submit">Submit</button>
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
}

//comment check order
const CheckOrder = async (flowerId) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `https://flower-seal.vercel.app/flowers/check_order/?flowerId=${flowerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to check order status");
    }
    const data = await response.json();
    return data.order_exists;
  } catch (error) {
    console.error("Error checking order:", error);
    return false;
  }
};

//comment part
const post_comment = (flowerId) => {
  const comment_button = document.getElementById("submit_buttons");
  comment_button.addEventListener("click", async (event) => {
    event.preventDefault();
    const hasOrdered = await CheckOrder(flowerId);
    if (!hasOrdered) {
      alert("You need to purchase the flower before commenting.");
      location.reload();
      return;
    }

    const username = document.getElementById("name").value;
    const usertext = document.getElementById("text").value;

    fetch("https://flower-seal.vercel.app/flowers/comments_api/", {
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
          throw new Error("Network response was not ok");
        }
        alert("Comment Successfully!");
        location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to post comment.");
      });
  });
};

const get_comments = (flowerId) => {
  fetch(`https://flower-seal.vercel.app/flowers/get_comment/${flowerId}/`)
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

  let commentsHtml = comments
    .map(
      (comment) => `
    <div class="col-md-4 col-lg-6 mb-4">
      <div class="card bg-white text-dark p-3 index_flower_card" style="border-radius: 10px;">
        <h5>${comment.name}</h5> 
        <p>${comment.body}</p>
        <small>${comment.created_on}</small>
        <br>
        <div class="d-flex gap-3">
          <div>
            <a class="btn btn-success edit-comment" data-id="${comment.id}" data-name="${comment.name}" data-body="${comment.body}">Edit</a>
          </div>
          <div>
            <a class="btn btn-danger delete-comment" data-id="${comment.id}">Delete</a>
          </div>    
        </div>   
      </div>
    </div>
  `
    )
    .join("");

  commentdiv.innerHTML = `<div class="row">${commentsHtml}</div>`;
};

//comment edit
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  document.getElementById("comments-list")
    .addEventListener("click", (event) => {
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

  document.getElementById("edit-comment-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      location.reload();
      const commentId = document.getElementById("edit-comment-id").value;
      const commentName = document.getElementById("edit-comment-name").value;
      const commentBody = document.getElementById("edit-comment-body").value;

      try {
        const response = await fetch(
          `https://flower-seal.vercel.app/flowers/comments/${commentId}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify({ name: commentName, body: commentBody }),
          }
        );

        if (response.ok) {
          document.getElementById("edit-comment-form").style.display = "none";
          const updatedComments = get_comments();
          displayComment(updatedComments);
        } else {
          const errorData = await response.json();
          console.error("Failed to update comment: ", errorData);
          alert(
            `Failed to update comment: ${errorData.detail || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Error: ", error);
        alert("Comment Edit Successfully!");
      }
    });
});

//delete comment
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  document
    .getElementById("comments-list")
    .addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete-comment")) {
        const commentId = event.target.getAttribute("data-id");
        try {
          if (confirm("Are you sure you want to delete this comment?")) {
            const response = await fetch(
              `https://flower-seal.vercel.app/flowers/comments/${commentId}/`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `token ${token}`,
                },
              }
            );

            if (response.ok) {
              const commentElement = event.target.closest(".card");
              commentElement.remove();
              const updatedComments = get_comments();
              displayComment(updatedComments);
            } else {
              alert("Failed to delete comment");
            }
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Comment Delete Successfully!");
          location.reload();
        }
      }
    });
});
