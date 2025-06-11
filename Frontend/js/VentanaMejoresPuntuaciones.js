//Lógica para obtener ultimo salto 
const API_URL = 'http://127.0.0.1:8000/ultimo_participante/'; 

fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los datos");
        }
        return response.json();
    })
    .then(data => {
        const lastBody = document.getElementById("lastScoreTableBody");
        lastBody.innerHTML = "";  // Limpia contenido anterior si lo hay

        const row = document.createElement("tr");
        if (data.ultimo_salto.puntaje === -1){
            ultimo_salto = "Descalificado";
        }
        else{
            ultimo_salto = data.ultimo_salto.puntaje;
        }
        row.innerHTML = `
            <td>${data.posicion_en_ranking}</td>
            <td>${data.deportista}</td>
            <td>${ultimo_salto}</td>
            <td>${data.total_puntaje.toFixed(3)}</td>
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

            data.slice(0, 5).forEach(item => {
                const fila = document.createElement("tr");

                // Calculamos el promedio general
                const total = item.promedios.reduce((a, b) => a + b, 0).toFixed(3);
                

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

