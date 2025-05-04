const btnAbrirModal = document.querySelector("#openModalBtn");
const modal = document.querySelector("#modal");
const btnCrear = document.querySelector("#crear");
const modalcreado = document.querySelector("#modalcreado");

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
  const credencial = generarCredencial();
  modal.close();
  dialog.reset();

  const spanCredencial = document.getElementById("credencial");
  if (spanCredencial) {
      spanCredencial.textContent = credencial;
  }

  modalcreado.showModal();
});


// Aquí se cargan los organizadores

fetch('') // Llenar con la dirección de la API que devuelve los organizadores
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById('organizador-container');
    data.forEach(org => {
      const div = document.createElement('div');
      div.textContent = org.name; // Nota: Necesitamos guardar el nombre del organizador como "name"
      //div.classList.add('item-usuario'); // Aquí se puede agregar el CSS, pero no se dearrolla ahora
      contenedor.appendChild(div);
    });
  })
  .catch(err => console.error('Error cargando organizadores:', err));


  // Aquí se cargan los jueces

fetch('') // Llenar con la dirección de la API que devuelve los jueces
.then(res => res.json())
.then(data => {
  const contenedor = document.getElementById('jueces-container');
  data.forEach(org => {
    const div = document.createElement('div');
    div.textContent = org.name; // Nota: Necesitamos guardar el nombre del juez como "name"
    //div.classList.add('item-usuario'); // Aquí se puede agregar el CSS, pero no se dearrolla ahora
    contenedor.appendChild(div);
  });
})
.catch(err => console.error('Error cargando jueces:', err));