const btnAbrirModal = document.querySelector("#openModalBtn");
const modal = document.querySelector("#modal");
const btnCrear = document.querySelector("#crear");
const modalcreado = document.querySelector("#modalcreado");
const password = localStorage.getItem("admin_password");

 
actualizarTablaAdministradores();


function verCredencialAdministrador(nombre) {
  fetch(`http://127.0.0.1:8000/ver_credencial_administrador/${encodeURIComponent(nombre)}/`)
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





function eliminarAdministrador(nombre) {
  fetch(`http://127.0.0.1:8000/eliminar_administrador/${encodeURIComponent(nombre)}/`, {
    method: 'DELETE',

    
})

.then(res => {
  if(res.ok) {
    console.log('Administrador eliminado');

  } else {
    return res.json().then(data => {
      throw new Error(data.error || "Error al eliminar");
    });

  }
actualizarTablaAdministradores(); // Actualiza la tabla de organizadores después de eliminar
})
.catch(err => {
  console.error('Error eliminando administrador:', err);
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

modal.style.display = "none";
modalcreado.style.display = "none";

btnAbrirModal.addEventListener("click",function(){
    modal.style.display= "flex";
})


btnCrear.addEventListener("click", function (e) {
    e.preventDefault();
    const credencial = generarCredencial();
    fetch('http://127.0.0.1:8000/crear_administrador/',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "nombre": document.querySelector("#nombrecompleto").value,
            "password": credencial,
        }),
    })

    .then(async (res) => {
            const data = await res.json();
        if (res.ok) {

            modal.close();
            modalcreado.showModal(); 
            document.querySelector("#credencial").textContent = "La credencial generada es: " + credencial;
        }
         else {
              alert("Error: " + JSON.stringify(data));
            }
          actualizarTablaAdministradores();
    })
  
  document.getElementById("nombrecompleto").value = "";

});
    

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape"){
    modal.style.display = "none";
    modalcreado.style.display = "none";
  }
})

// Aquí se cargan los administradores

function actualizarTablaAdministradores() {
  fetch('http://127.0.0.1:8000/listar_administradores/')
    .then(res => res.json())
    .then(data => {
      const cuerpoTablaOrganizadores = document.getElementById('cuerpoTablaOrganizadores');
      cuerpoTablaOrganizadores.innerHTML = ''; // Limpiar tabla
      

      data.forEach(org => {

        if (org.nombre !== "Administrador de Respaldo"){
            const fila = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = org.nombre;

        const celdaVer = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.textContent = 'Ver Credencial';
        btnVer.addEventListener('click', () => {
          console.log('Ver Credencial', org.nombre);

          verCredencialAdministrador(org.nombre);

        });
        celdaVer.appendChild(btnVer);

        const celdaEliminar = document.createElement('td');
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
          console.log('Eliminar', org.nombre);
          eliminarAdministrador(org.nombre); 
        });
        celdaEliminar.appendChild(btnEliminar);

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaVer);
        fila.appendChild(celdaEliminar);

        cuerpoTablaOrganizadores.appendChild(fila);
        }
      });
    })
    .catch(err => console.error('Error cargando organizadores:', err));
}
