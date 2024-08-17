//post 
function fetchPosts() {
    fetch("http://127.0.0.1:8000/admins/post_list/")
        .then(response => response.json())
        .then(data => {
            let postList = document.getElementById("post-list");
            postList.innerHTML = "";
            data.forEach(post => {
                let postCard = `
                <div class="post-card" id="post-${post.id}">
                    <h2>${post.title}</h2>
                    <img src="${post.image}" alt="${post.title}">
                    <p>${post.content}</p>
                    <p>Price: $${post.price}</p>
                    <p>Category: ${post.category}</p>
                    <p>Stock: ${post.stock}</p>
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                </div>
                `;
                postList.innerHTML += postCard;
            });
    })
    .catch(error => console.error("Error fetching posts:", error));
}


//edit post
function editPost(postId) {
    fetch(`http://127.0.0.1:8000/admins/post_detail/${postId}/`)
        .then(response => response.json())
        .then(post => {
            document.getElementById("edit-post-id").value = post.id;
            document.getElementById("edit-title").value = post.title;
            document.getElementById("edit-content").value = post.content;
            document.getElementById("edit-price").value = post.price;
            document.getElementById("edit-image").value = post.image;
            document.getElementById("edit-category").value = post.category;
            document.getElementById("edit-stock").value = post.stock;
            document.getElementById("edit-post-form").style.display = "block";
        })
        .catch(error => console.error("Error fetching post for edit:", error));
}

document.getElementById("edit-post-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const postId = document.getElementById("edit-post-id").value;
    const formData = new FormData();
    formData.append('title', document.getElementById("edit-title").value);
    formData.append('content', document.getElementById("edit-content").value);
    formData.append('price', document.getElementById("edit-price").value);
    formData.append('category', document.getElementById("edit-category").value);
    formData.append('stock', document.getElementById("edit-stock").value);

    const imageFile = document.getElementById("edit-image").files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    fetch(`http://127.0.0.1:8000/admins/post_detail/${postId}/`, {
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

//user list
function fetchUsers() {
    fetch("http://127.0.0.1:8000/admins/user_list/")
        .then(response => response.json())
        .then(data => {
            let userList = document.getElementById("user-list");
            userList.innerHTML = "";
            data.forEach(user => {
                let userCard = `
                <div class="user-card">
                    <h2>${user.username}</h2>
                    <p>First Name: ${user.first_name}</p>
                    <p>Last Name: ${user.last_name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Disabled: ${user.is_disabled ? "Yes" : "No"}</p>
                </div>
            `;
                userList.innerHTML += userCard;
            });
        })
        .catch(error => console.error("Error fetching users:", error));
}

//form post
document.getElementById("create-post-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    console.log(token);
    const formData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        image: document.getElementById("image").value,
        category: document.getElementById("category").value,
        stock: document.getElementById("stock").value,
    };
    console.log(formData);

    fetch("http://127.0.0.1:8000/admins/post_list/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Post created:", data);
            alert("Post created successfully!");
        })
        .catch(error => console.error("Error creating post:", error));
});

fetchUsers();
fetchPosts();