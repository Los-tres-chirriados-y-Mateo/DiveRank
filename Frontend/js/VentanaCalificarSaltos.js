const credencial = localStorage.getItem("juez_password");
const btnCalificar = document.querySelector("#SubmitRating");
const btnDescalificar = document.querySelector("#SubmitDisqualify");

async function idDeportista(deportistaNombre) {
    const res = await fetch(`http://127.0.0.1:8000/id_deportista/${encodeURIComponent(deportistaNombre)}/`);
    const data = await res.json();
    return data.id;
}

function nombreJuez() {
    fetch('http://127.0.0.1:8000/buscar_juez_por_credencial/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "credencial": credencial })
    })
    .then(res => {
        if (res.status === 200) return res.json();
        else throw new Error("Error obteniendo juez");
    })
    .then(data => {
        document.querySelector("#username").textContent = data.nombre;
        sessionStorage.setItem("IDJuez", data.id);
        console.log("Juez encontrado:", data.nombre);
        cargarCompetidores(); // Después de tener el juez
    })
    .catch(err => console.error("Error:", err));
}

nombreJuez();

function cargarCompetidores() {
    const juezId = sessionStorage.getItem("IDJuez");

    fetch("http://127.0.0.1:8000/listar_deportistas/")
        .then(res => {
            if (res.status === 200) return res.json();
            else throw new Error("Error obteniendo competidores");
        })
        .then(data => {
            let iActual = parseInt(sessionStorage.getItem(`iActual_${juezId}`));
            let JActual = parseInt(sessionStorage.getItem(`JActual_${juezId}`));

            if (isNaN(iActual)) iActual = 1;
            if (isNaN(JActual)) JActual = 0;

            if (iActual > data.length) {
                JActual = (JActual < 5) ? JActual + 1 : 0;
                iActual = 1;
            }

            sessionStorage.setItem(`iActual_${juezId}`, iActual);
            sessionStorage.setItem(`JActual_${juezId}`, JActual);

            const participante = data.find(org => org.orden === iActual);
            if (participante) {
                sessionStorage.setItem("NombreDeportista", participante.nombre);
                document.querySelector("#participantList").textContent = participante.nombre;
                document.querySelector("#numsalto").textContent = JActual + 1;
                document.querySelector("#dificultadsalto").textContent = participante.saltos[JActual].dificultad;
            }
        })
        .catch(err => console.error("Error:", err));
}

btnCalificar.addEventListener("click", async () => {
    const juezId = sessionStorage.getItem("IDJuez");
    let iActual = parseInt(sessionStorage.getItem(`iActual_${juezId}`) || "0");
    iActual++;
    sessionStorage.setItem(`iActual_${juezId}`, iActual.toString());

    cargarCompetidores();

    const deportistaId = await idDeportista(sessionStorage.getItem("NombreDeportista"));

    fetch("http://127.0.0.1:8000/registrar/puntuacion_individual/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "deportista_id": deportistaId,
            "juez_id": juezId,
            "puntaje": document.querySelector("#ratingInput").value
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error registrando puntuación");
        return res.json();
    })
    .then(data => {
        console.log("Puntuación registrada:", data);
        document.getElementById("ratingInput").value = "";
    })
    .catch(err => console.error("Error:", err));
});

btnDescalificar.addEventListener("click", async () => {
    const juezId = sessionStorage.getItem("IDJuez");
    let iActual = parseInt(sessionStorage.getItem(`iActual_${juezId}`) || "0");
    iActual++;
    sessionStorage.setItem(`iActual_${juezId}`, iActual.toString());

    cargarCompetidores();

    const deportistaId = await idDeportista(sessionStorage.getItem("NombreDeportista"));

    fetch("http://127.0.0.1:8000/registrar/puntuacion_individual/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "deportista_id": deportistaId,
            "juez_id": juezId,
            "puntaje": -1
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error registrando puntuación");
        return res.json();
    })
    .then(data => console.log("Puntuación registrada (descalificado):", data))
    .catch(err => console.error("Error:", err));
});


// Prueba de css

document.getElementById("username").textContent = "Juez María";
document.getElementById("role").textContent = "Juez Principal";

const participants = ["Juan Pérez", "Laura Sánchez", "Carlos Ruiz"];
const list = document.getElementById("participantList");

participants.forEach(name => {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.textContent = name;
  row.appendChild(cell);
  list.appendChild(row);
});

document.getElementById("numsalto").textContent = "Salto #3";
document.getElementById("dificultadsalto").textContent = "2.5";
