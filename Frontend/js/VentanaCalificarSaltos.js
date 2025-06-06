const credencial = localStorage.getItem("juez_password");
console.log(credencial);


function nombreJuez() {
    fetch('http://127.0.0.1:8000/buscar_juez_por_credencial/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "credencial": credencial,
        }),
})
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Error obteniendo juez");
        }
    })
    .then(data => {
        document.querySelector("#username").textContent = data.nombre;
        console.log("Juez encontrado:", data.nombre);
    })
    .catch(err => {
        console.error("Error:", err);
    });
}

nombreJuez();
