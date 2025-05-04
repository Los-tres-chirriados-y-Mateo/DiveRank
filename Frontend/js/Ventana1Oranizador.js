

// Función para llenar la tabla
function llenarTabla(competidores) {
    const tbody = document.querySelector("#tabla-competidores tbody");
  
    // Limpiamos la tabla antes de llenarla
    tbody.innerHTML = '';
  
    competidores.forEach(comp => {
      const fila = document.createElement("tr"); //Creamos filas para la tabla
  
      const celdaOrden = document.createElement("td");
      celdaOrden.textContent = comp.orden; //El orden de los competidores debe ser almacenado como "orden"
  
      const celdaNombre = document.createElement("td"); //El nombre de los competidores debe ser almacenado como "nombre"
      celdaNombre.textContent = comp.nombre;
  
      const celdaSaltos = document.createElement("td");//El número de saltos de los competidores debe ser almacenado como "saltos"
      celdaSaltos.textContent = comp.saltos;

      const celdaBoton = document.createElement("td"); 
      const boton = document.createElement("button"); //Estamos creando el botón
      boton.textContent = "Definir dificultad";
      boton.classList.add("btn-definir");
      boton.dataset.id = comp.orden; //Almacenamos el id del competidor en el botón, el cual será el orden
      
      celdaBoton.appendChild(boton);
  
      fila.appendChild(celdaOrden);
      fila.appendChild(celdaNombre);
      fila.appendChild(celdaSaltos);
  
      tbody.appendChild(fila);
    });
  }
  
  // Obtener los datos desde la API
  fetch('')  // URL de la API que devuelve los datos
    .then(response => response.json())  // Aquí se convierten los datos a JSON
    .then(data => {
      // Se llama a la función
      llenarTabla(data);
    })
    .catch(error => {
      console.error('Error al obtener los datos de la API:', error); // Por si aparece algún error
    });

