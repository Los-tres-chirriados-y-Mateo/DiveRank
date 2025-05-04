const btnadminmodal = document.querySelector("#admin-btn");
const adminModal = document.querySelector("#adminModal");
const closebtn = document.querySelector("#admin-cancel");
const dialog = document.querySelector("#adminForm");
const loginbtn = document.querySelector("#admin-login");

btnadminmodal.addEventListener("click", function () {
    adminModal.showModal();
});

closebtn.addEventListener("click", function () {
    dialog.reset();
});

loginbtn.addEventListener("click", function (e) {
    e.preventDefault();

    const credencial = document.querySelector("#admin-credencial").value;

    fetch("", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        }
})
.then(res => res.json())
.then(data => {
    if (data.status === true) {
        
    } else {
        alert("Credenciales incorrectas");
    }
})

.catch(error => {
    console.error("Error:", error);
});
});