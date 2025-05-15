const nombreJugadorDificultad = localStorage.getItem("nombreJugadorDificultad")
console.log(nombreJugadorDificultad)

document.querySelector("#nombre").textContent = nombreJugadorDificultad;


const nombre = localStorage.getItem("nombreJugadorDificultad");

if (nombre) {
  fetch(`http://127.0.0.1:8000/buscar_deportista/${encodeURIComponent(nombre)}/`)
    .then(res => {
      if (!res.ok) {
        throw new Error("No se encontró el deportista");
      }
      return res.json();
    })
    .then(data => {
      console.log("Datos del deportista:", data);
      document.getElementById("nombre").textContent = data.nombre;
      crearFilasSaltos(data.saltos);
    })
    .catch(error => {
      console.error("Error al buscar deportista:", error);
      alert(error.message);
    });
}


function crearFilasSaltos(saltos) {
  const tbody = document.querySelector('#tabla-competidor tbody');
  tbody.innerHTML = '';

  saltos.forEach((salto, index) => {
    const fila = document.createElement('tr');

    const tdNumero = document.createElement('td');
    tdNumero.textContent = index + 1;

    const tdNombreSalto = document.createElement('td');
    const inputNombre = document.createElement('input');
    inputNombre.type = "text";
    inputNombre.value = salto.nombre || "";
    tdNombreSalto.appendChild(inputNombre);

    const tdDificultad = document.createElement('td');
    const inputDificultad = document.createElement('input');
    inputDificultad.type = "number";
    inputDificultad.step = "0.1";
    inputDificultad.min = "0";
    inputDificultad.value = salto.dificultad || 0;
    tdDificultad.appendChild(inputDificultad);

    fila.appendChild(tdNumero);
    fila.appendChild(tdNombreSalto);
    fila.appendChild(tdDificultad);

    tbody.appendChild(fila);
  });
}


// Función para obtener los saltos desde la tabla
function obtenerDatosSaltos() {
  const filas = document.querySelectorAll('#tabla-competidor tbody tr');
  const saltos = [];

  filas.forEach(fila => {
    const inputNombre = fila.querySelector('td:nth-child(2) input');
    const inputDificultad = fila.querySelector('td:nth-child(3) input');

    saltos.push({
      nombre: inputNombre.value.trim(),
      dificultad: parseFloat(inputDificultad.value) || 0
    });
  });

  return saltos;
}

// Listener para el botón guardar
document.getElementById('guardar').addEventListener('click', () => {
  const saltosActualizados = obtenerDatosSaltos();
  const nombre = localStorage.getItem("nombreJugadorDificultad");

  if (!nombre) {
    alert("No se encontró el nombre del deportista");
    return;
  }

  fetch(`http://127.0.0.1:8000/actualizar_saltos/${encodeURIComponent(nombre)}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ saltos: saltosActualizados })
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al guardar los datos");
    return res.json();
  })
  .then(data => {
    alert(data.mensaje || "Datos guardados exitosamente");
    window.location.href = "./Ventana1Organizador.html";
  })
  .catch(err => {
    console.error(err);
    alert("No se pudo guardar la información");
  });
});
