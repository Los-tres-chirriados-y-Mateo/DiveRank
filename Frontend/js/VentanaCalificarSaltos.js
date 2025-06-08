const credencial = localStorage.getItem("juez_password");
console.log(credencial);
const btnCalificar = document.querySelector("#SubmitRating");
console.log(localStorage.getItem("iActual"));

if (localStorage.getItem("iActual") === null) {
    localStorage.setItem("iActual", 1);
}





function nombreJuez() {
    fetch('http://127.0.0.1:8000/buscar_juez_por_credencial/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "credencial": credencial,
        }),
})
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Error obteniendo juez");
        }
    })
    .then(data => {
        document.querySelector("#username").textContent = data.nombre;
        console.log("Juez encontrado:", data.nombre);
    })
    .catch(err => {
        console.error("Error:", err);
    });
}

nombreJuez();


function cargarCompetidores() {
    fetch("http://127.0.0.1:8000/listar_deportistas/")
    .then(res => {

        if (res.status === 200) {
            return res.json();
            
        } else {
            throw new Error("Error obteniendo competidores");
        }
    })
    .then(data =>{
        
        data.forEach(org => {

            if (org.orden == localStorage.getItem("iActual")) {
                document.querySelector("#participantList").textContent = org.nombre;
            }
        }
    )
})

            
        
    
}

cargarCompetidores();

btnCalificar.addEventListener("click", () => {
    let iActual = parseInt(localStorage.getItem("iActual") || "0"); 
    iActual++; 
    localStorage.setItem("iActual", iActual.toString()); 
    cargarCompetidores(); 
});