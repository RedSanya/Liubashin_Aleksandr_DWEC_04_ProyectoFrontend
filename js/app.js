
import { buscarAnime, mostrarAnimes, mostrarColeccion } from "./kitsu-api.js";

/**
 * Función para cargar contenido basado en los parámetros de la URL
 */
async function cargarContenidoDesdeURL() {
   const params = new URLSearchParams(window.location.search);
   const categoria = params.get("categoria");
   const busqueda = params.get("buscar");

   if (categoria) {
      await mostrarColeccion(categoria);
   } else if (busqueda) {
      const animes = await buscarAnime(busqueda);
      mostrarAnimes(animes);
   } else {
      // Si no hay categoría ni búsqueda, mostramos "Recientes" por defecto
      await mostrarColeccion("recientes");
   }
}
/**
 * Manejador del evento de búsqueda
 */
async function handleSearch() {

   event.preventDefault(); // Evita que el formulario haga un refresh de la página

   const nombre = document.getElementById("animeInput").value;
   if (!nombre) {
      alert("Escribe un nombre de anime para buscar.");
      return;
   }
   // const animes = await buscarAnime(nombre);
   // mostrarAnimes(animes);
   window.location.href = `${window.location.origin}/index.html?buscar=${encodeURIComponent(nombre)}`;// Redirige al index.html en la raíz, sin importar desde qué página estés
}

// Agregar eventos cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
   document.getElementById("buscarForm").addEventListener("submit", handleSearch);
   cargarContenidoDesdeURL(); // Cargar recientes por defecto si no hay otra opción en la URL
});

// Exportamos handleSearch (buscar anime) para poder realizar busqueda en otras paginas
export { handleSearch };