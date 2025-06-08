const credencial = localStorage.getItem("juez_password");
console.log(credencial);
const btnCalificar = document.querySelector("#SubmitRating");
console.log(localStorage.getItem("iActual")); 











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
    .then(data => {
    let iActual = parseInt(localStorage.getItem("iActual"));
    
    if (isNaN(iActual) || iActual > data.length) {
        if (iActual > data.length) {
            if(localStorage.getItem("JActual") != 6) {
                localStorage.setItem("JActual", parseInt(localStorage.getItem("JActual"))+1);
            }
            else {
                localStorage.setItem("JActual", 0);
            }
            
        }
        iActual = 1;
        localStorage.setItem("iActual", iActual);
    }

    data.forEach(org => {
        if (org.orden == iActual) {
            document.querySelector("#participantList").textContent = org.nombre;
            document.querySelector("#numsalto").textContent = localStorage.getItem("JActual");
            document.querySelector("#dificultadsalto").textContent = org.orden;
        }
    });
});
            
        
    
}

cargarCompetidores();

btnCalificar.addEventListener("click", () => {
    let iActual = parseInt(localStorage.getItem("iActual") || "0"); 
    iActual++; 
    localStorage.setItem("iActual", iActual.toString()); 
    cargarCompetidores(); 
    console.log(localStorage.getItem("JActual"));
});