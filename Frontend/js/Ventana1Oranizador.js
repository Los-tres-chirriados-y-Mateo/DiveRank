const password = localStorage.getItem("organizador_password");
const btnAgregar = document.querySelector("#agregar-competidor")

console.log(password);
llenarTabla();



fetch("http://127.0.0.1:8000/buscar_organizador_por_credencial/",{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "credencial": password,
  }),
})
.then(res => {
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error("Error obteniendo organizador");
  }
})
.then(data => {
  document.querySelector("#username").textContent = data.nombre;
  console.log("Organizador encontrado:", data.nombre);
})
.catch(err => {
  console.error("Error:", err);
});

// Función para llenar la tabla
function llenarTabla() {
  fetch('http://127.0.0.1:8000/listar_deportistas/')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const tbody = document.querySelector('#tabla-competidores tbody');
      tbody.innerHTML = ''; // Limpiamos la tabla antes de llenarla
      

      data.forEach(org => {
        const fila = document.createElement('tr');

        const orden = document.createElement('td');
        orden.textContent = org.orden;

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = org.nombre;

        num_saltos = document.createElement('td');
        num_saltos.textContent = org.num_saltos;

        btnDificultad = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.textContent = 'Definir dificultad';
        btnVer.addEventListener('click', () => {
          
          localStorage.setItem("nombreJugadorDificultad", org.nombre)
          window.location.href = "./Ventana2Organizador.html";
          
        });
        btnDificultad.appendChild(btnVer);

        fila.appendChild(orden);
        fila.appendChild(celdaNombre);
        fila.appendChild(num_saltos);
        fila.appendChild(btnDificultad);
        tbody.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar competidores:', error);
    });
  }

 function agregarCompetidor(nombre, saltos) {
    nombre = document.querySelector("#nombre").value;
    saltos = document.querySelector("#saltos").value;

    fetch('http://127.0.0.1:8000/crear_deportistas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        "deportistas":
        [
          {
        "nombre": nombre,
        "num_saltos": parseInt(saltos),
          }
        ]
        
      }),
    })
    .then(async (res) => {
        if (!res.ok) { // Verifica si la respuesta fue exitosa
            throw new Error('Error en la solicitud');
        }
        const data = await res.json(); 
        console.log('Competidor agregado:', data.nombre);
        llenarTabla();
        document.querySelector("#nombre").value="";
        document.querySelector("#saltos").value="";
    })
    .catch(error => {
        console.error('Error al cargar competidores:', error);
        alert('Hubo un problema al agregar el competidor.');
    });
}

btnAgregar.addEventListener('click', () => {
  agregarCompetidor();
})