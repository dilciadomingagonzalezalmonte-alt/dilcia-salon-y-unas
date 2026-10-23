
document.addEventListener("DOMContentLoaded", function () {
    let carrito = [];

    // Crear el espacio del carrito debajo del catálogo.
    const catalogo = document.querySelector(".catalogo");

    if (!catalogo) {
        alert("No se encontró el catálogo de productos.");
        return;
    }

    const contenedor = document.createElement("section");
    contenedor.id = "carrito";
    contenedor.innerHTML = `
        <h2>Carrito de pedidos</h2>
        <p>Productos seleccionados: <strong id="cantidad">0</strong></p>
        <div id="lista-carrito"></div>
        <h3>Total a pagar: <span id="total">RD$0</span></h3>
        <button type="button" id="pagar">Pagar</button>
        <button type="button" id="vaciar">Vaciar carrito</button>
        <button type="button" id="completar">Completar pago</button>
        <p id="mensaje" aria-live="polite"></p>
    `;

    catalogo.insertAdjacentElement("afterend", contenedor);

    const lista = document.getElementById("lista-carrito");
    const cantidad = document.getElementById("cantidad");
    const totalTexto = document.getElementById("total");
    const mensaje = document.getElementById("mensaje");

    function formatoPrecio(precio) {
        return "RD$" + precio.toLocaleString("es-DO");
    }

    function actualizarCarrito() {
        lista.innerHTML = "";

        let total = 0;
        let unidades = 0;

        carrito.forEach(function (producto, indice) {
            total += producto.precio * producto.cantidad;
            unidades += producto.cantidad;

            const fila = document.createElement("div");
            fila.className = "pedido";

            const descripcion = document.createElement("span");
            descripcion.textContent =
                producto.nombre + " x " + producto.cantidad +
                " — " + formatoPrecio(producto.precio * producto.cantidad);

            const quitar = document.createElement("button");
            quitar.type = "button";
            quitar.textContent = "Quitar";
            quitar.addEventListener("click", function () {
                carrito.splice(indice, 1);
                actualizarCarrito();
            });

            fila.append(descripcion, quitar);
            lista.appendChild(fila);
        });

        cantidad.textContent = unidades;
        totalTexto.textContent = formatoPrecio(total);

        return total;
    }

    // Crear automáticamente un botón para cada diseño del catálogo.
    document.querySelectorAll(".producto").forEach(function (producto) {
        const nombre = producto.querySelector("h3").textContent.trim();
        const textoPrecio = producto.querySelector("p").textContent;
        const precio = Number(textoPrecio.replace(/[^\d]/g, ""));

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Añadir al carrito";

        boton.addEventListener("click", function () {
            const existente = carrito.find(function (item) {
                return item.nombre === nombre;
            });

            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                });
            }

            mensaje.textContent = nombre + " se añadió al carrito.";
            actualizarCarrito();
        });

        producto.appendChild(boton);
    });

    // Botón Pagar: guardar el total y abrir el formulario de pago.
    document.getElementById("pagar").addEventListener("click", function () {
        const total = actualizarCarrito();

        if (total === 0) {
            mensaje.textContent = "Añade un diseño al carrito antes de pagar.";
            return;
        }

        localStorage.setItem("totalCompra", String(total));
        localStorage.setItem("pedidosDilcia", JSON.stringify(carrito));

        window.location.href = "pago.html";
    });

    // Vaciar todos los pedidos.
    document.getElementById("vaciar").addEventListener("click", function () {
        carrito = [];
        actualizarCarrito();
        mensaje.textContent = "El carrito está vacío.";
        localStorage.removeItem("totalCompra");
        localStorage.removeItem("pedidosDilcia");
    });

    // Completar el pago.
    document.getElementById("completar").addEventListener("click", function () {
        const total = actualizarCarrito();

        if (total === 0) {
            mensaje.textContent = "Primero debes añadir un diseño al carrito.";
            return;
        }

        localStorage.setItem("totalCompra", String(total));
        localStorage.setItem("pedidosDilcia", JSON.stringify(carrito));

        window.location.href = "formulario de pago.html";
    });
});
