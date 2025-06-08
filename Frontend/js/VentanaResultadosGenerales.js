const API_URL = '';

console.time("Cargando último salto");

fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los datos.");
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;
    })
    .catch({

});

function CargarTablaResultadosGenerales(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Error al cargar los datos del ranking");
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById("GeneralResultsBody");
            tbody.innerHTML = ""; // Limpia cualquier contenido

            data.forEach(item => {
                const fila = document.createElement("tr");

                const total = item.promedios.reduce((a, b) => a + b, 0);

                
                fila.innerHTML = `
                    <td>${item.posicion}</td>
                    <td>${item.deportistaNombre}</td>
                    <td>${item.promedios[0] ?? ''}</td>
                    <td>${item.promedios[1] ?? ''}</td>
                    <td>${item.promedios[2] ?? ''}</td>
                    <td>${item.promedios[3] ?? ''}</td>
                    <td>${item.promedios[4] ?? ''}</td>
                    <td>${item.promedios[5] ?? ''}</td>
                    <td>${total}</td>
                    <td>
                        <button class="ver-mas-btn" data-id="${item.id}">Ver más</button>
                    </td>
                `;
                tbody.appendChild(fila);
                console.timeEnd("Cargando último resultado");
            });

            tbody.querySelectorAll('.ver-mas-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    window.location.href = `VentanaVerMas.html?id=${id}`;
                });
            });
        })
        .catch(err => {
            console.error("Error cargando tablar", err);
        });
}

CargarTablaResultadosGenerales('http://127.0.0.1:8000/listar_ranking/')