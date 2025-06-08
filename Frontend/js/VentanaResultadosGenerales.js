// Datos de ejemplo (puedes obtenerlos de un backend si lo deseas)
let resultados = [];

async function obtenerResultados() {
    try{
        const response = await fetch('http://127.0.0.1:8000/listar_ranking/')
        if (!response.ok) throw new Error('Error al obtener resultados');
        resultados = await response.json();
        crearTablaResultados();
    } catch (error) {
        console.error(error);
        document.getElementById('tabla-contenedor').innerHTML = '<p>Error al cargar los resultados.</p>';
    }
}

function crearTablaResultados() {
    const contenedor = document.getElementById('tabla-contenedor');
    let tabla = `<table class="tabla-competidor">
        <thead>
            <tr>
                <th>Puesto</th>
                <th>Nombre</th>
                <th>Salto 1</th>
                <th>Salto 2</th>
                <th>Salto 3</th>
                <th>Salto 4</th>
                <th>Salto 5</th>
                <th>Salto 6</th>
                <th>Acumulado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
    `;

    resultados.forEach((competidor, idx) => {
        tabla += `<tr>
            <td>${idx + 1}</td>
            <td>${competidor.nombre}</td>
            ${competidor.saltos.map(s => `<td>${s}</td>`).join('')}
            <td>${competidor.acumulado}</td>
            <td><button class="ver-mas" onclick="verMas(${idx})">Ver más</button></td>
        </tr>`;
    });

    tabla += `</tbody></table>`;
    contenedor.innerHTML = tabla;
}

// Ejemplo de función para el botón "Ver más"
window.verMas = function(idx) {
    alert("Detalles de " + resultados[idx].nombre);
}

// Puedes poner aquí la lógica para mostrar el usuario y rol si lo necesitas
document.getElementById('username').textContent = "";
document.getElementById('role').textContent = "";

// Llama a la función al cargar la página
crearTablaResultados();