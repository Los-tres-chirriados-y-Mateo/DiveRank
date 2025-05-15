const btnAbrirModal = document.querySelector("#openModalBtn");
const modal = document.querySelector("#modal");
const btnCrear = document.querySelector("#crear");
const modalcreado = document.querySelector("#modalcreado");
const password = localStorage.getItem("admin_password");


// Iniciamos cargando las tablas
actualizarTablaJueces();
actualizarTablaOrganizadores();

function verCredencialJuez(nombre) {
  fetch(`http://127.0.0.1:8000/ver_credencial_juez/${encodeURIComponent(nombre)}/`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    alert("La credencial para " + nombre + " es: " + data);
  }

  )
}

function verCredencialOrganizador(nombre) {
  fetch(`http://127.0.0.1:8000/ver_credencial_organizador/${encodeURIComponent(nombre)}/`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    alert("La credencial para " + nombre + " es: " + data)
  })
}


//Aquí se va a buscar el nombre del usuario por la credencial (Yo sé que no es seguro, pero no tenemos ningún otro dato del cliente xd)
fetch("http://127.0.0.1:8000/buscar_administrador_por_credencial/",{
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
    throw new Error("Error obteniendo administrador");
  }
})
.then(data => {
  document.querySelector("#username").textContent = data.nombre;
  console.log("Administrador encontrado:", data.nombre);
})
.catch(err => {
  console.error("Error:", err);
});




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
actualizarTablaJueces(); // Actualiza la tabla de jueces después de eliminar
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
actualizarTablaOrganizadores(); // Actualiza la tabla de organizadores después de eliminar
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
          actualizarTablaOrganizadores(); // Actualiza la tabla de organizadores después de crear

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
          actualizarTablaJueces(); // Actualiza la tabla de jueces después de crear
          });
        
    break;

  }
  document.getElementById("rolRegistrar").value = "";
  document.getElementById("nombrecompleto").value = "";
  document.getElementById("cedula").value = "";
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
            
            verCredencialJuez(org.nombre);
            
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
  