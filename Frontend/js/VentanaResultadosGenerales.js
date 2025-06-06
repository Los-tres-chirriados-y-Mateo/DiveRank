// Datos de ejemplo (puedes obtenerlos de un backend si lo deseas)
const resultados = [
    
];

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

function actualizarTablaResultadosGenerales() { // Este codigo no funciona aún; hay que modificcarlo, pero funciona de modelo para lo que se quiere
  fetch('http://127.0.0.1:8000/listar_y_actualizar_rankin/')
    .then(res => res.json())
    .then(data => {
      const cuerpoTablaOrganizadores = document.getElementById('tablaContenedor');
      cuerpoTablaOrganizadores.innerHTML = ''; // Limpiar tabla
      

      data.forEach(org => {
        const fila = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = org.deportista;

        const celdaVer = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.textContent = 'Ver Credencial';
        btnVer.addEventListener('click', () => {
          console.log('Ver Credencial', org.nombre);

          verCredencialOrganizador(org.nombre);

        });
        celdaVer.appendChild(btnVer);

        const celdaEliminar = document.createElement('td');
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
          console.log('Eliminar', org.nombre);
          eliminarOrganizador(org.nombre); 
        });
        celdaEliminar.appendChild(btnEliminar);

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaVer);
        fila.appendChild(celdaEliminar);

        cuerpoTablaOrganizadores.appendChild(fila);
      });
    })
    .catch(err => console.error('Error cargando organizadores:', err));
}

actualizarTablaResultadosGenerales();