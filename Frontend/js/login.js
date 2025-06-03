const btnadminmodal = document.querySelector("#admin-btn");
const adminModal = document.querySelector("#adminModal");
const closebtn = document.querySelector("#admin-cancel");
const dialog = document.querySelector("#adminForm");
const loginbtn = document.querySelector("#admin-login");
const ingresar = document.querySelector("#btn-ingresar");   
document.getElementById("public-btn").addEventListener("click", function() {
    window.location.href = "VentanaMejoresPuntuaciones.html";
});

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
            switch (credencial) {
                case "1234567890":
                    window.location.href = "./VentanaAdministrarAdministradores.html";
                    break;
                default:
                    window.location.href = "./VentanaAdmin.html";
                    break;
            }
             
        } else {
            alert("Credenciales incorrectas");
            dialog.reset();
            adminModal.close();
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
    localStorage.setItem("admin_password", credencial);
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
                    credencial = localStorage.setItem("juez_password", credencial);
                    break;
                case "organizador":
                    console.log("Iniciaindo como organizador");
                    window.location.href = "./Ventana1Organizador.html";
                    credencial = localStorage.setItem("organizador_password", credencial);
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