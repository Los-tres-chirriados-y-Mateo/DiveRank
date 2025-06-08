const credencial = localStorage.getItem("juez_password");
console.log(credencial);
const btnCalificar = document.querySelector("#SubmitRating");
console.log(localStorage.getItem("iActual")); 

async function idDeportista(deportistaNombre) {
    const res = await fetch(`http://127.0.0.1:8000/id_deportista/${encodeURIComponent(deportistaNombre)}/`);
    const data = await res.json();
    return data.id;
};










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
        localStorage.setItem("IDJuez", data.id);
        
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
            if(localStorage.getItem("JActual") < 5) {
                localStorage.setItem("JActual", parseInt(localStorage.getItem("JActual"))+1);
            }
            else {
                localStorage.setItem("JActual", 0);
            }
            
        }
        iActual = 1;
        localStorage.setItem("iActual", iActual);
        
    }
    console.log(data);

    data.forEach(org => {
        if (org.orden == iActual) {
            localStorage.setItem("NombreDeportista", org.nombre);
            document.querySelector("#participantList").textContent = org.nombre;
            document.querySelector("#numsalto").textContent = parseInt(localStorage.getItem("JActual"))+1;
            document.querySelector("#dificultadsalto").textContent = org.saltos[localStorage.getItem("JActual")].dificultad;
            
        }
    });
});
            
        
    
}

cargarCompetidores();

btnCalificar.addEventListener("click", async () => {
    let iActual = parseInt(localStorage.getItem("iActual") || "0"); 
    iActual++; 
    localStorage.setItem("iActual", iActual.toString()); 
    cargarCompetidores(); 
    console.log(localStorage.getItem("JActual"));

    const deportistaId = await idDeportista(localStorage.getItem("NombreDeportista")); // aquí sí esperamos

    fetch("http://127.0.0.1:8000/registrar/puntuacion_individual/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify({
            "deportista_id": deportistaId,
            "juez_id": localStorage.getItem("IDJuez"),
            "puntaje": document.querySelector("#ratingInput").value,
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error registrando puntuación");
        return res.json();
    })
    .then(data => {
        console.log("Puntuación registrada:", data);
    })
    .catch(err => {
        console.error("Error:", err);
    });
});



idDeportista(localStorage.getItem("NombreDeportista"))
