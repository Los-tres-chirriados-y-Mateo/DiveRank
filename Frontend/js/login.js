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
            dialog.reset();
            adminModal.close();
            window.location.href = "./VentanaAdmin.html"; 
        } else {
            alert("Credenciales incorrectas");
            dialog.reset();
            adminModal.close();
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
            console.log(rol);
            switch (rol) {
                case "jurado":
                    console.log("Iniciando como juez");
                    window.location.href = ""; // Poner la dirección de la ventana del juez cuandos se haga
                    break;
                case "organizador":
                    console.log("Iniciaindo como organizador");
                    window.location.href = "./Ventana1Organizador.html";
                    break;
            }
            
        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});