// Logica para enviar calificaciones

async function enviarCalificacion(data) {
  try {
    const response = await fetch("http:api/calificaciones/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Error al enviar calificación");

    const result = await response.json();
    alert("Calificación enviada correctamente");
    console.log(result);
  } catch (error) {
    alert("Error al guardar la calificación: " + error.message);
  }
}

//Logica Para obtener los datos 
document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("SubmitRating");

  submitButton.addEventListener("click", () => {
    const participanteId = selectedParticipantId;
    const salto = document.getElementById("JumpType").textContent;
    const dificultad = parseFloat(document.getElementById("difficulty").textContent);
    const calificacion = parseFloat(document.getElementById("ratingInput").value);
    const juezId = 2;

    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
      alert("La calificación debe estar entre 0 y 10.");
      return;
    }

    const data = {
      participante: participanteId,
      salto: salto,
      dificultad: dificultad,
      calificacion: calificacion,
      juez: juezId
    };

    enviarCalificacion(data);
  });
});
