const btnAbrirModal = document.querySelector("#openModalBtn");
const modal = document.querySelector("#modal");
const btnCrear = document.querySelector("#crear");
const modalcreado = document.querySelector("#modalcreado");

setInterval(actualizarTablaOrganizadores, 1000);
setInterval(actualizarTablaJueces, 1000);


function eliminarJuez(nombre) {
  fetch(`http://127.0.0.1:8000/eliminar_juez/${encodeURIComponent(nombre)}/`, {
    method: 'DELETE',

})

.then(res => {
  if(res.ok) {
    console.log('Juez eliminado');
  } else {
    return res.json().then(data => {
      throw new Error(data.error || "Error al eliminar");
    });
  }
})

.catch(err => {
  console.error('Error eliminando organizador:', err);
});
};

function eliminarOrganizador(nombre) {
  fetch(`http://127.0.0.1:8000/eliminar_organizador/${encodeURIComponent(nombre)}/`, {
    method: 'DELETE',

    
})

.then(res => {
  if(res.ok) {
    console.log('Organizador eliminado');

  } else {
    return res.json().then(data => {
      throw new Error(data.error || "Error al eliminar");
    });

  }
})
.catch(err => {
  console.error('Error eliminando organizador:', err);
});


}


function generarCredencial(longitud = 10) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let credencial = '';
  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    credencial += caracteres[indiceAleatorio];
  }
  return credencial;
}


btnAbrirModal.addEventListener("click",function(){
    modal.showModal();
})


btnCrear.addEventListener("click", function () {

  const rol = document.querySelector("#rolRegistrar").value;
  const nombre = document.querySelector("#nombrecompleto").value;
  const cedula = document.querySelector("#cedula").value;
  const credencial = generarCredencial();

  switch(rol){ // Aquí lo que hace el codigo es que verifica el rol del usuario que quiero crear, y, dependiendo de este, selecciona la ruta para crearlo

    case "organizador":
      
      fetch("http://127.0.0.1:8000/crear_organizador/", {
        method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "nombre": nombre,
                "cedula": cedula,
                "password": credencial,
            }),
          })

          .then(async (res) => {
            const data = await res.json();
            console.log("Status:", res.status);
            console.log("Respuesta:", data);
          
            if (res.ok) {
              modal.close();
              modalcreado.showModal();
              document.querySelector("#credencial").textContent = "La credencial generada es: " + credencial;
            } else {
              alert("Error: " + JSON.stringify(data));
            }
          });
        
    break;

    case "jurado":
      
      fetch("http://127.0.0.1:8000/crear_juez/", {
        method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "nombre": nombre,
                "cedula": cedula,
                "password": credencial,
            }),
          })

          .then(async (res) => {
            const data = await res.json();
            console.log("Status:", res.status);
            console.log("Respuesta:", data);
          
            if (res.ok) {
              modal.close();
              modalcreado.showModal();
              document.querySelector("#credencial").textContent = "La credencial generada es: " + credencial;
            } else {
              alert("Error: " + JSON.stringify(data));
            }
          });
        
    break;

  }
});
    

// Aquí se cargan los organizadores

function actualizarTablaOrganizadores() {
  fetch('http://127.0.0.1:8000/listar_organizadores/')
    .then(res => res.json())
    .then(data => {
      const cuerpoTablaOrganizadores = document.getElementById('cuerpoTablaOrganizadores');
      cuerpoTablaOrganizadores.innerHTML = ''; // Limpiar tabla

      data.forEach(org => {
        const fila = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = org.nombre;

        const celdaVer = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.textContent = 'Ver Credencial';
        btnVer.addEventListener('click', () => {
          console.log('Ver Credencial', org.nombre);
          // Aquí puedes agregar la lógica para ver la credencial
        });
        celdaVer.appendChild(btnVer);

        const celdaEliminar = document.createElement('td');
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
          console.log('Eliminar', org.nombre);
          eliminarOrganizador(org.nombre); // Asegúrate de tener esta función definida
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




  // Aquí se cargan los jueces

  function actualizarTablaJueces() {
    fetch('http://127.0.0.1:8000/listar_jueces/')
      .then(res => res.json())
      .then(data => {
        const cuerpoTablaJueces = document.getElementById('listaJueces');
        cuerpoTablaJueces.innerHTML = ''; // Limpiar tabla
  
        data.forEach(org => {
          const fila = document.createElement('tr');
          
          const celdaNombre = document.createElement('td');
          celdaNombre.textContent = org.nombre;
  
          const celdaVer = document.createElement('td');
          const btnVer = document.createElement('button');
          btnVer.textContent = 'Ver Credencial';
          btnVer.addEventListener('click', () => {
            console.log('Ver Credencial', org.nombre);
            // lógica para ver la credencial
          });
          celdaVer.appendChild(btnVer);
  
          const celdaEliminar = document.createElement('td');
          const btnEliminar = document.createElement('button');
          btnEliminar.textContent = 'Eliminar';
          btnEliminar.addEventListener('click', () => {
            console.log('Eliminar', org.nombre);
            eliminarJuez(org.nombre); // Asegúrate de tener esta función definida
          });
          celdaEliminar.appendChild(btnEliminar);
  
          fila.appendChild(celdaNombre);
          fila.appendChild(celdaVer);
          fila.appendChild(celdaEliminar);
  
          cuerpoTablaJueces.appendChild(fila);
        });
      })
      .catch(err => console.error('Error cargando jueces:', err));
  }
  