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
                  <div class="d-flex gap-3">
                       <div>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal"    data-bs-target="#orderModal">
                       Order Now
                      </button>
                   </div>
                  <div>
                       ${post_comment(flowerId, names, comment) ? `<a class="btn btn-warning text-white" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                        Comment
                        </a>`: ''}
                  </div>
                  </div>
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
                              <input id="quantity" type="number" class="form-control">
                          </div>
                          <button type="button" class="btn btn-outline-primary pl-5" id="order_submit">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--comment area-->
                  <div class="collapse" id="collapseExample">
                  <div class="card-body">
                  <section>
                    <br/>
                    <div class="comment-section container card bg-white index_flower_card" id="index_flower_card"
                      style="border-radius: 10px;">
                      <div id="commentForm" class="row g-3 mx-auto w-100 gap-3" style="padding-top: 30px">
                        <div class="col-md-12">
                          <label for="name" class="form-label"><b>Name : </b></label>
                          <input type="text" class="form-control" id="name" name="name" required />
                        </div>
                        <div class="col-md-12">
                          <label for="text" class="form-label"><b>Messages : </b></label>
                          <textarea class="form-control" id="text" name="text" required></textarea>
                        </div>
                        <div class="col-12">
                          <button type="submit" class="btn btn-outline-info" id="submit_buttons">
                            Submit
                          </button>
                        </div>
                        <br/>
                      </div>
                    </div>
                    <script>
                      const pageReload = () => {
                        window.location.reload();
                      }
                    </script>
                    <div id="comments-section" class="container mt-5">
                      <h3 class="text-dark">
                        Total Count >> <span id="comments-count">0</span>
                      </h3>
                      <div id="comments-list" class="list-group"></div>
                    </div>
                  </section>
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

//comment part  
const post_comment = async (flowerId, names, comment) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("https://django-final-exam-backend-part.onrender.com/flowers/comments_api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify({
        flowerId: flowerId,
        names: names,
        comment: comment,
      })
    });
    if (!response.ok) {
      throw new Error("Failed to create comment");
    }
    const data = await response.json();
    console.log('Comment created:', data);
  } catch (error) {
    console.error('Error creating comment:', error);
  }
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

//check order comment
// const CheckOrder = async (flowerId) => {
//   const token = localStorage.getItem("authToken");
//   try {
//     const response = await fetch("https://django-final-exam-backend-part.onrender.com/flowers/check_order/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `token ${token}`,
//       },
//       body: JSON.stringify({
//         flowerId: flowerId,
//       })
//     });
//     if (!response.ok) {
//       throw new Error("Failed to check order status");
//     }
//     const data = await response.json();
//     return data.order_exists;
//   } catch (error) {
//     console.error('Error checking order:', error);
//     return false;
//   }
// };

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

