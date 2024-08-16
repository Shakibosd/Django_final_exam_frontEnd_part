document.addEventListener('DOMContentLoaded', function () {
    const adminBtn = document.querySelector('.btn-success');

    adminBtn.addEventListener('click', function () {
        const token = localStorage.getItem("authToken");
        // fetch("http://127.0.0.1:8000/flowers/admin-dashboard/", {
        //     method: 'GET',
        //     headers: {
        //         "Content-Type": 'application/json',
        //         Authorization: `token ${token}`
        //     }
        // })
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     if (data.message) {
            //         alert(data.message);
            //     }
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     
            // });
            alert('I will complete the admin dashboard soon..');
    });
});