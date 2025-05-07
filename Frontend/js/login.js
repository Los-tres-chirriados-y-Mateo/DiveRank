const btnadminmodal = document.querySelector("#admin-btn");
const adminModal = document.querySelector("#adminModal");
const closebtn = document.querySelector("#admin-cancel");
const dialog = document.querySelector("#adminForm");
const loginbtn = document.querySelector("#admin-login");
const ingresar = document.querySelector("#btn-ingresar");   

btnadminmodal.addEventListener("click", function () {
    adminModal.showModal();
});

closebtn.addEventListener("click", function () {
    dialog.reset();
});

loginbtn.addEventListener("click", function (e) {
    e.preventDefault();

    const credencial = document.querySelector("#admin-credencial").value;

    fetch("http://127.0.0.1:8000/admin_login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "password": credencial,
        }),
    })
    
    .then(res => {
        if (res.status === 200){
            alert("Credenciales correctas, redirigiendo a la página de administración...");
        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});



ingresar.addEventListener("click", function (e) {
    e.preventDefault();

    const credencial = document.querySelector("#credencial").value;
    const rol = document.querySelector("#userType").value;
    fetch("http://127.0.0.1:8000/rol_login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "rol": rol,
            "password": credencial,
        }),
    })
    
    .then(res => {
        if (res.status === 200){
            alert("Credenciales correctas, redirigiendo a la página de administración...");
        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});