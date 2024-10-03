//post
function fetchPosts() {
  fetch("https://flower-seal.vercel.app/flowers/flowers/")
    .then((response) => response.json())
    .then((data) => {
      let postList = document.getElementById("post-list");
      postList.innerHTML = "";
      data.forEach((post) => {
        console.log(post.id);
        let postCard = `
                    <div class="post-card card w-100 index_flower_card" style="border-radius: 20px;" id="post-${post.id}">
                        <br/>
                        <img class="w-50 d-block mx-auto" style="height: 300px; border-radius:10px;" src="${post.image}" alt="${post.title}">
                        <br/>
                        <div class="m-3">
                            <h4>Title : ${post.title}</h4>
                            <p>Description : ${post.description}</p>
                            <p>Price : ${post.price} ৳</p>
                            <small>Category : <button class="btn btn-secondary"> ${post.category}</button></small>
                            <p>Stock : ${post.stock}</p>
                            <div class="d-flex gap-3">
                            <div>
                                <button class="btn btn-success" onclick="editPost(${post.id})">Edit</button>
                            </div>
                            <div>
                                <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
                            </div>
                                <br/>
                                <br/>
                            </div>
                        <div>
                    </div>
                </div>
            </div>
                <br/>
                <br/>
                `;
        postList.innerHTML += postCard;
      });
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

//edit post
function editPost(postId) {
  console.log("inside edit post", postId);
  fetch(`https://flower-seal.vercel.app/flowers/flowers/${postId}/`)
    .then((response) => response.json())
    .then((post) => {
      document.getElementById("edit-post-id").value = post.id;
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-description").value = post.description;
      document.getElementById("edit-price").value = post.price;
      document.getElementById("edit-category").value = post.category;
      document.getElementById("edit-stock").value = post.stock;
      document.getElementById("edit-image").value = post.image.files[0];
      console.log(post.title);
    })
    .catch((error) => console.error("Error fetching post for edit:", error));
}

document
  .getElementById("edit-post-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const postId = document.getElementById("edit-post-id").value;
    const formData = new FormData();
    formData.append("title", document.getElementById("edit-title").value);
    formData.append(
      "description",
      document.getElementById("edit-description").value
    );
    formData.append("price", document.getElementById("edit-price").value);
    formData.append("category", document.getElementById("edit-category").value);
    formData.append("stock", document.getElementById("edit-stock").value);

    const imageFile = document.getElementById("edit-image").files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetch(`https://flower-seal.vercel.app/flowers/flowers/${postId}/`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update post");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Post updated:", data);
        alert("Post updated successfully!");
        document.getElementById("edit-post-form").style.display = "none";
        fetchPosts();
      })
      .catch((error) => console.error("Error updating post:", error));
  });

//delete post
function deletePost(postId) {
  const token = localStorage.getItem("authToken");
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`https://flower-seal.vercel.app/admins/post_detail/${postId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Post deleted successfully!");
          document.getElementById(`post-${postId}`).remove();
        } else {
          alert("Failed to delete the post.");
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  }
}

// Fetch user list
function fetchUsers() {
  const token = localStorage.getItem("authToken");
  fetch("https://flower-seal.vercel.app/admins/user_list/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let userList = document.getElementById("user-list");
      userList.innerHTML = "";
      data.forEach((user) => {
        let userCard = `
                <div class="user-card card mx-auto w-100 pt-5 index_flower_card" style="border-radius:20px;" id="user-${
                  user.id
                }">
                    <div class="m-4">
                         <h3>Username : ${user.username}</h3>
                            <p>First Name: ${user.first_name}</p>
                            <p>Last Name: ${user.last_name}</p>
                            <p>Email: ${user.email}</p>
                            <p id="status-${user.id}">Disabled: ${
          user.is_disabled ? "YES" : "NO"
        }</p>
                            <button class="w-50 btn btn-${
                              user.is_disabled ? "success" : "danger"
                            }" 
                                onclick="toggleUserStatus(${user.id}, ${
          user.is_disabled ? "false" : "true"
        })">
                                ${user.is_disabled ? "Enable" : "Disable"}
                            </button>
                    </div>
                    <br>
                </div>
                <br>
                `;
        userList.innerHTML += userCard;
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

// Toggle user status (enable/disable)
function toggleUserStatus(userId, disable) {
  const token = localStorage.getItem("authToken");
  const url = disable
    ? `https://flower-seal.vercel.app/admins/disable_user/${userId}/`
    : `https://flower-seal.vercel.app/admins/enable_user/${userId}/`;

  fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
    body: JSON.stringify({ is_disabled: disable }),
  })
    .then((response) => response.json())
    .then((data) => {
      const statusElement = document.getElementById(`status-${userId}`);
      const userCard = document.getElementById(`user-${userId}`);
      const toggleButton = userCard.querySelector("button");

      // Update status text and button
      statusElement.innerHTML = `Disabled: ${disable ? "YES" : "NO"}`;
      statusElement.style.color = disable ? "red" : "green";

      // Toggle button text and class
      toggleButton.textContent = disable ? "Enable" : "Disable";
      toggleButton.className = `btn btn-${disable ? "success" : "danger"}`;

      alert(`User ${disable ? "disabled" : "enabled"} successfully.`);
    })
    .catch((error) => console.error("Error updating user status:", error));
}

//form post
document
  .getElementById("create-post-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const image_Input = document.getElementById("imageInput").files[0];

    // Ensure a file is selected
    if (!image_Input) {
      alert("Please select an image file.");
      return;
    }

    const fmData = new FormData();
    fmData.append("image", image_Input);

    fetch(
      "https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035",
      {
        method: "POST",
        body: fmData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Image uploaded:", data);

        if (data.success) {
          const imageUrl = data.data.url;

          const postData = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            category: document.getElementById("category").value,
            stock: parseInt(document.getElementById("stock").value),
            image: imageUrl,
          };

          const token = localStorage.getItem("authToken");

          console.log(JSON.stringify(postData));
          fetch("https://flower-seal.vercel.app/admins/post_list/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(postData),
          })
            .then((postResponse) => postResponse.json())
            .then((postData) => {
              console.log("Post created successfully:", postData);
              alert("Post created successfully!");
              location.reload();
            })
            .catch((error) => console.error("Error creating post:", error));
        } else {
          console.error("Error uploading image:", data);
          alert("Image upload failed!");
        }
      })
      .catch((error) => console.error("Error uploading image:", error));
  });

fetchUsers();
fetchPosts();
