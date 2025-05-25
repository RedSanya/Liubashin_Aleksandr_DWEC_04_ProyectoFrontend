
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
async function handleSearch(e) {
   e.preventDefault();

   const input = document.getElementById("animeInput") || document.getElementById("buscar-input");
   if (!input || !input.value.trim()) {
      alert("Escribe un nombre de anime para buscar.");
      return;
   }

   const nombre = input.value.trim();
   window.location.href = `${window.location.origin}/index.html?buscar=${encodeURIComponent(nombre)}`;
}


// Carga las noticias de  rss api
const url = "https://api.rss2json.com/v1/api.json?rss_url=https://somoskudasai.com/feed";

async function cargarNoticiasAnime() {
   const aside = document.getElementById("layout-aside");
   if (!aside) return;

   aside.innerHTML = "<h2>Noticias</h2>";

   try {
      const res = await fetch(url);
      const data = await res.json();

      data.items.slice(0, 6).forEach(item => {
         const link = document.createElement("a");
         link.href = item.link;
         link.target = "_blank";
         link.style.textDecoration = "none";

         const article = document.createElement("article");
         article.classList.add("card-news");

         const h3 = document.createElement("h3");
         h3.textContent = item.title;

         const p = document.createElement("p");
         p.textContent = item.description.slice(0, 100) + "...";

         article.appendChild(h3);
         article.appendChild(p);
         link.appendChild(article);

         aside.appendChild(link);
      });
   } catch (err) {
      console.error("Error cargando noticias RSS:", err);
      aside.innerHTML += "<p>No se pudieron cargar las noticias.</p>";
   }
}


document.addEventListener("layout-cargado", () => {
   const form = document.getElementById("buscarForm") || document.getElementById("buscar-form");
   if (form) {
      form.addEventListener("submit", handleSearch);
   }
});

// Agregar eventos cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
   cargarNoticiasAnime();
   cargarContenidoDesdeURL(); // Cargar recientes por defecto si no hay otra opción en la URL
});

// Exportamos handleSearch (buscar anime) para poder realizar busqueda en otras paginas
export { handleSearch };