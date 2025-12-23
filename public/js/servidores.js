'use strict';

const URL = 'https://694a4f4a1282f890d2d84377.mockapi.io/servidores/servidor';

let formulario, tabla;

globalThis.addEventListener('DOMContentLoaded', async () => {
    formulario = document.forms[0];
   
    mostrarTabla();
});

function anyadir() {
    
    formulario.reset();
    mostrarFormulario();

}

async function borrar(id) {
    
    if (!confirm('¿Estás seguro de que quieres borrar el servidor con id ' + id + '?')) {
        return;
    }

    try {
        const response = await fetch(`${URL}/${id}`, { method: 'DELETE' });

        console.log(response.statusText);

        mostrarTabla();
    } catch (error) {
        console.error(error);
    }
}

async function guardar() {
    const cpuPrecio = parseInt(formulario.cpu.value.split('- ')[1] || 0);
    const ramPrecio = parseInt(formulario.ram.value.split('- ')[1] || 0);
    const almacenamientoPrecio = parseInt(formulario.Almacenamiento.value.split('- ')[1] || 0);
    const presupuestoTotal = cpuPrecio + ramPrecio + almacenamientoPrecio;

    formulario.precio.value = presupuestoTotal;

    if (presupuestoTotal > 700) {
        alert('El presupuesto total no debe superar los 700 euros.');
        return;
    }

    const servidor = {
        nombre: formulario.nombre.value,
        cpu: formulario.cpu.value,
        ram: formulario.ram.value,
        almacenamiento: formulario.Almacenamiento.value,
        precio: presupuestoTotal
    };

    const id = formulario.id.value;

    let url, metodo;

     url = URL;
     metodo = 'POST';

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(servidor),
        });

        const data = await response.json();

        console.log(data);
        formulario.reset();
        mostrarTabla();
    } catch (error) {
        console.error(error);
        alert('Error al guardar el producto');
    }
}

async function mostrarTabla() {
    await recargarTabla();

}

async function recargarTabla() {
    const respuesta = await fetch(URL);
    const servidores = await respuesta.json();
    console.log(servidores);
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    

    for (const servidor of servidores) {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
        <h3>${servidor.nombre}</h3>
        <p><strong>CPU:</strong> ${servidor.cpu}</p>
        <p><strong>RAM:</strong> ${servidor.ram}</p>
         <p><strong>Almacenamiento:</strong> ${servidor.almacenamiento}</p>
         <p><strong>Precio Total:</strong> ${servidor.precio }€</p>
           <div class="actions">
            <button class="btn btn-danger" type="button" onclick="borrar('${servidor.id}')">🗑️ Borrar</button>
        </div>
    `;
        container.appendChild(card);
    }
}


