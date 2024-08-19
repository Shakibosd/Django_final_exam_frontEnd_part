//post 
function fetchPosts() {
    fetch("http://127.0.0.1:8000/flowers/flowers/")
        .then(response => response.json())
        .then(data => {
            let postList = document.getElementById("post-list");
            postList.innerHTML = "";
            data.forEach(post => {
                console.log(post.id);
                let postCard = `
                    <div class="post-card card w-50 mx-auto index_flower_card" style="border-radius: 20px;" id="post-${post.id}">
                        <br/>
                        <img class="w-50 d-block rounded mx-auto" style="height: 200px;" src="${post.image}" alt="${post.title}">
                        <br/>
                        <div class="m-3">
                            <h4>Title : ${post.title}</h4>
                            <p>Description : ${post.description}</p>
                            <p>Price : $${post.price}</p>
                            <p>Category : ${post.category}</p>
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
        .catch(error => console.error("Error fetching posts:", error));
}


//edit post
function editPost(postId) {
    console.log("inside edit post", postId);
    fetch(`http://127.0.0.1:8000/flowers/flowers/${postId}/`)
        .then(response => response.json())
        .then(post => {
            document.getElementById("edit-post-id").value = post.id;
            document.getElementById("edit-title").value = post.title;
            document.getElementById("edit-description").value = post.description;
            document.getElementById("edit-price").value = post.price;
            document.getElementById("edit-category").value = post.category;
            document.getElementById("edit-stock").value = post.stock;
            document.getElementById("edit-image").value = post.image.files[0];
            console.log(post.title);
        })
        .catch(error => console.error("Error fetching post for edit:", error));
}

document.getElementById("edit-post-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const postId = document.getElementById("edit-post-id").value;
    const formData = new FormData();
    formData.append('title', document.getElementById("edit-title").value);
    formData.append('description', document.getElementById("edit-description").value);
    formData.append('price', document.getElementById("edit-price").value);
    formData.append('image', document.getElementById("edit-image").value).files[0];
    formData.append('category', document.getElementById("edit-category").value);
    formData.append('stock', document.getElementById("edit-stock").value);

    const imageFile = document.getElementById("edit-image").files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    fetch(`http://127.0.0.1:8000/flowers/flowers/${postId}/`, {
        method: "PUT",
        headers: {
            Authorization: `token ${token}`,
        },
        body: JSON.stringify(formData),
    })

        .then(response => response.json())
        .then(data => {
            console.log("Post updated:", data);
            alert("Post updated successfully!");
            document.getElementById("edit-post-form").style.display = "none";
            fetchPosts();
        })
        .catch(error => console.error("Error updating post:", error));
});

//delete post
function deletePost(postId) {
    const token = localStorage.getItem("authToken");
    if (confirm("Are you sure you want to delete this post?")) {
        fetch(`http://127.0.0.1:8000/admins/post_detail/${postId}/`, {
            method: "DELETE",
            headers: {
                Authorization: `token ${token}`,
            },
        })
            .then(response => {
                if (response.ok) {
                    alert("Post deleted successfully!");
                    document.getElementById(`post-${postId}`).remove();
                } else {
                    alert("Failed to delete the post.");
                }
            })
            .catch(error => console.error("Error deleting post:", error));
    }
}

// Fetch user list
function fetchUsers() {
    const token = localStorage.getItem("authToken");
    fetch("http://127.0.0.1:8000/admins/user_list/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            let userList = document.getElementById("user-list");
            userList.innerHTML = "";
            data.forEach(user => {
                let userCard = `
                <div class="user-card card mx-auto w-50 pt-3 index_flower_card" style="border-radius:20px;" id="user-${user.id}">
                    <div class="m-4">
                         <h3>Username : ${user.username}</h3>
                            <p>First Name: ${user.first_name}</p>
                            <p>Last Name: ${user.last_name}</p>
                            <p>Email: ${user.email}</p>
                            <p id="status-${user.id}">Disabled: ${user.is_disabled ? "YES" : "NO"}</p>
                            <button class="w-25 btn btn-${user.is_disabled ? "success" : "danger"}" 
                                onclick="toggleUserStatus(${user.id}, ${user.is_disabled ? 'false' : 'true'})">
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
        .catch(error => console.error("Error fetching users:", error));
}

// Toggle user status (enable/disable)
function toggleUserStatus(userId, disable) {
    const token = localStorage.getItem("authToken");
    const url = disable
        ? `http://127.0.0.1:8000/admins/disable_user/${userId}/`
        : `http://127.0.0.1:8000/admins/enable_user/${userId}/`;

    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
        },
        body: JSON.stringify({ is_disabled: disable })
    })
        .then(response => response.json())
        .then(data => {
            const statusElement = document.getElementById(`status-${userId}`);
            statusElement.innerHTML = `Disabled: ${disable ? "YES" : "NO"}`;
            statusElement.style.color = disable ? "red" : "green";

            // Update button text and style based on the new status
            const userCard = document.getElementById(`user-${userId}`);
            const toggleButton = userCard.querySelector("button");
            toggleButton.textContent = disable ? "Enable" : "Disable";
            toggleButton.className = `btn btn-${disable ? "success" : "danger"}`;

            toggleButton.textContent = enable ? "Disable" : "Enable";
            toggleButton.className = `btn btn-${enable ? "danger" : "success"}`;

            alert(`User ${disable ? "disabled" : "enabled"} successfully.`);
            alert(`User ${enable ? "enabled" : "disabled"} successfully.`);
        })
        .catch(error => console.error("Error updating user status:", error));
}


//form post
// document.getElementById("create-post-form").addEventListener("submit", function (e) {
//     e.preventDefault();
//     const token = localStorage.getItem("authToken");
//     console.log(token);
//     const formData = {
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         price: document.getElementById("price").value,
//         imageInput: document.getElementById("imageInput").files[0],
//         category: document.getElementById("category").value,
//         stock: parseInt(document.getElementById("stock").value),
//     };
//     // console.log(imageInput); 
//     // console.log(JSON.stringify(formData));
//     console.log(formData);

//     fetch("http://127.0.0.1:8000/admins/post_list/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `token ${token}`,
//         },
//         body: JSON.stringify(formData),
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Post created:", data);
//             alert("Post created successfully!");
//             location.reload();
//         })
//         .catch(error => console.error("Error creating post:", error));
// });

document.getElementById("create-post-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fmData = new FormData();
    const image_Input = document.getElementById("imageInput").files[0];

    fmData.append('image', image_Input);

    for (let pair of fmData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    fetch("https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035", {
        method: "POST",
        body: fmData,
    })
        .then(response => response.json())
        .then(data => {
            console.log("Image uploaded:", data);

            if (data.success) {
                const imageUrl = data.data.url;

                const postData = {
                    title: document.getElementById("title").value,
                    description: document.getElementById("description").value,
                    price: document.getElementById("price").value,
                    category: document.getElementById("category").value,
                    stock: parseInt(document.getElementById("stock").value),
                    image: imageUrl
                };

                console.log(JSON.stringify(postData));

                fetch("http://127.0.0.1:8000/admins/post_list/", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(postResponse => postResponse.json())
                    .then(postData => {
                        console.log("Post created successfully:", postData);
                        alert("Post created successfully!");
                    })
                    .catch(error => console.error("Error creating post:", error));
            } else {
                console.error("Error uploading image:", data);
                alert("Image upload failed!");
            }
        })
        .catch(error => console.error("Error uploading image:", error));
});


fetchUsers();
fetchPosts();
