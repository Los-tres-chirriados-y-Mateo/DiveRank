//Lógica para obtener ultimo salto 
const API_URL = ''; 

fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los datos");
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;

        const lastParticipant = data[data.length - 1];
        const lastBody = document.getElementById("lastScoreTableBody");

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>1</td>
            <td>${lastParticipant.nombre}</td>
            <td>${lastParticipant.puntuacion}</td>
        `;
        lastBody.appendChild(row);
    })
    .catch(error => {
        console.error("Error:", error);
    });
