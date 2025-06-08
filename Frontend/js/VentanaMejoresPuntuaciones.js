//Lógica para obtener ultimo salto 
const API_URL = ''; 

console.time("Cargando último salto");

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


    function cargarTablaRanking(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener datos del ranking");
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById("scoresTableBody");
            tbody.innerHTML = ""; // Limpia cualquier contenido anterior

            data.forEach(item => {
                const fila = document.createElement("tr");

                // Calculamos el promedio general
                const total = item.promedios.reduce((a, b) => a + b, 0);
                

                fila.innerHTML = `
                    <td>${item.posicion}</td>
                    <td>${item.deportistaNombre}</td>
                    <td>${total}</td>
                `;
                tbody.appendChild(fila);
                console.timeEnd("Cargando último salto");
            });

        })
        .catch(err => {
            console.error("Error cargando tabla:", err);
        });
}

// Llama esta función cuando cargue tu página o en el momento que necesites
cargarTablaRanking('http://127.0.0.1:8000/listar_ranking/');

