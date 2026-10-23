
// Carrito de compras de Dilcia Salón y Uñas

let carrito = JSON.parse(localStorage.getItem("carritoDilcia")) || [];

const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const cantidadElemento = document.getElementById("cantidad");
const mensaje = document.getElementById("mensaje");

// Guardar el carrito
function guardarCarrito() {
    localStorage.setItem("carritoDilcia", JSON.stringify(carrito));
}

// Mostrar los productos y calcular el total
function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    }

    carrito.forEach((producto, indice) => {
        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;
        cantidadTotal += producto.cantidad;

        const articulo = document.createElement("div");
        articulo.className = "item-carrito";

        articulo.innerHTML = `
            <span>${producto.nombre}</span>
            <span>RD$${producto.precio.toLocaleString("es-DO")}</span>
            <div class="controles-cantidad">
                <button class="disminuir" data-indice="${indice}"
                    aria-label="Disminuir cantidad">-</button>
                <span>${producto.cantidad}</span>
                <button class="aumentar" data-indice="${indice}"
                    aria-label="Aumentar cantidad">+</button>
            </div>
            <strong>Subtotal: RD$${subtotal.toLocaleString("es-DO")}</strong>
            <button class="eliminar" data-indice="${indice}">
                Eliminar
            </button>
        `;

        listaCarrito.appendChild(articulo);
    });

    totalElemento.textContent = "RD$" + total.toLocaleString("es-DO");
    cantidadElemento.textContent = cantidadTotal;

    guardarCarrito();
}

// Añadir productos al carrito
document.querySelectorAll(".btn-agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        const existente = carrito.find(producto =>
            producto.nombre === nombre
        );

        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        mensaje.textContent = nombre + " agregado al carrito.";
        actualizarCarrito();
    });
});

// Aumentar, disminuir o eliminar productos
listaCarrito.addEventListener("click", evento => {
    const boton = evento.target;
    const indice = Number(boton.dataset.indice);

    if (boton.classList.contains("aumentar")) {
        carrito[indice].cantidad++;
    }

    if (boton.classList.contains("disminuir")) {
        carrito[indice].cantidad--;

        if (carrito[indice].cantidad <= 0) {
            carrito.splice(indice, 1);
        }
    }

    if (boton.classList.contains("eliminar")) {
        carrito.splice(indice, 1);
    }

    mensaje.textContent = "";
    actualizarCarrito();
});

// Vaciar todo el carrito
document.getElementById("vaciar").addEventListener("click", () => {
    if (carrito.length === 0) {
        mensaje.textContent = "El carrito ya está vacío.";
        return;
    }

    if (confirm("¿Deseas eliminar todos los productos del carrito?")) {
        carrito = [];
        actualizarCarrito();
        mensaje.textContent = "El carrito se ha vaciado.";
        localStorage.removeItem("totalCompra");
    }
});

// Botón Pagar: guardar el total y abrir el formulario
document.getElementById("pagar").addEventListener("click", () => {
    if (carrito.length === 0) {
        mensaje.textContent = "Agrega productos antes de pagar.";
        return;
    }

    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    localStorage.setItem("totalCompra", String(total));

    window.location.href = "pago.html";
});

// Mostrar el carrito guardado al abrir la página
actualizarCarrito();
