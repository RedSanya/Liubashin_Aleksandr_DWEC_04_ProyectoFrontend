
let currentOffset = 0; // Paginación actual
const limit = 20; // Máximo permitido por Kitsu API
let totalResults = 100; // Se actualizará dinámicamente con la API

/**
 * Función para buscar un anime por nombre con paginación
 * @param {string} nombre - Nombre del anime a buscar
 * @param {number} offset - Posición de la paginación
 * @returns {Promise} - Devuelve una lista de animes en formato JSON
 */
async function buscarAnime(nombre, offset = 0) {
   const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(nombre)}&page[limit]=${limit}&page[offset]=${offset}`;

   try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) {
         throw new Error(`Error en la petición: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      totalResults = datos.meta.count || 100; // Actualiza el número total de resultados
      return datos.data;
   } catch (error) {
      console.error("Error al buscar anime:", error);
      return [];
   }
}

/**
 * Función para obtener una colección de animes con paginación
 * @param {string} categoria - Tipo de filtro (top100, mejorCalificados, recientes, ongoing, random)
 * @param {number} offset - Página actual
 * @returns {Promise} - Devuelve una lista de animes en formato JSON
 */
async function obtenerColeccionAnimes(categoria, offset = 0) {
   let url = `https://kitsu.io/api/edge/anime?page[limit]=${limit}&page[offset]=${offset}`;

   switch (categoria) {
      case "top100":
         url += "&sort=popularityRank";
         break;
      case "mejorCalificados":
         url += "&sort=-averageRating";
         break;
      case "recientes":
         url += "&sort=-createdAt";
         break;
      case "ongoing":
         url += "&filter[status]=current";
         break;
      case "random":
         url += "&sort=popularityRank";
         break;
      default:
         console.error("Categoría de colección no válida.");
         return [];
   }

   try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) {
         throw new Error(`Error en la petición: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      totalResults = datos.meta.count || 100; // Actualiza el total de animes disponibles

      if (categoria === "random") {
         return seleccionarAleatorios(datos.data, 3);
      }

      return datos.data;
   } catch (error) {
      console.error("Error al obtener la colección de animes:", error);
      return [];
   }
}

/**
 * Función para mostrar animes en la página con la estructura de card
 * @param {Array} animes - Lista de animes obtenida de la API
 */
function mostrarAnimes(animes) {
   const resultadoDiv = document.getElementById("resultado");
   if (!resultadoDiv) return; // no hacer nada si no existe

   resultadoDiv.innerHTML = "";

   if (animes.length === 0) {
      resultadoDiv.innerHTML = "<p>No se encontraron animes.</p>";
      return;
   }

   animes.forEach(anime => {
      const animeCard = document.createElement("article");
      animeCard.classList.add("card");

      const img = document.createElement("img");
      img.src = anime.attributes.posterImage.original;
      img.alt = anime.attributes.titles.en || anime.attributes.titles.en_jp;

      const titulo = document.createElement("h3");
      titulo.textContent = anime.attributes.titles.en || anime.attributes.titles.en_jp;

      const animeInfo = document.createElement("div");
      animeInfo.classList.add("anime-info");

      const descripcion = document.createElement("p");
      descripcion.textContent = anime.attributes.synopsis
         ? anime.attributes.synopsis.substring(0, 200) + "..."
         : "Sin descripción disponible.";

      //--------------- Traducir el texto de la descripción-----------
      // const descripcion = document.createElement("p");
      // const textoOriginal = anime.attributes.synopsis
      //    ? anime.attributes.synopsis.substring(0, 200)
      //    : "Sin descripción disponible.";

      // traducirTexto(textoOriginal).then(textoTraducido => {
      //    descripcion.textContent = textoTraducido + "...";
      // });

      const boton = document.createElement("button");
      boton.textContent = "Ver Anime";
      boton.addEventListener("click", () => verAnime(anime.id));

      animeInfo.appendChild(descripcion);
      animeInfo.appendChild(boton);

      animeCard.appendChild(img);
      animeCard.appendChild(titulo);
      animeCard.appendChild(animeInfo);

      resultadoDiv.appendChild(animeCard);
   });
}

/**
 * Función para mostrar colecciones con paginación
 * @param {string} categoria - Categoría a mostrar
 * @param {number} offset - Página actual
 */
async function mostrarColeccion(categoria, offset = 0) {
   currentOffset = offset; // Guardamos el offset actual
   const animes = await obtenerColeccionAnimes(categoria, offset);
   mostrarAnimes(animes);
   actualizarPageNav(categoria); // Actualizar la paginación
}

/**
 * Función para actualizar los botones de paginación con números de página
 * @param {string} categoria - Categoría actual
 */
function actualizarPageNav(categoria) {
   const nav = document.getElementById("page-nav");
   if (!nav) return;
   nav.innerHTML = ""; // Limpiar antes de agregar nuevos botones

   const totalPages = Math.ceil(totalResults / limit);
   const currentPage = Math.floor(currentOffset / limit) + 1;
   const visiblePages = 5; // Número de páginas visibles

   // Botón "Anterior"
   const prevButton = document.createElement("button");
   prevButton.textContent = "Anterior";
   prevButton.disabled = currentOffset === 0;
   prevButton.onclick = () => mostrarColeccion(categoria, Math.max(0, currentOffset - limit));
   nav.appendChild(prevButton);

   //  Números de Página
   let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
   let endPage = Math.min(totalPages, startPage + visiblePages - 1);

   if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
   }

   for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.disabled = i === currentPage;
      pageButton.onclick = () => mostrarColeccion(categoria, (i - 1) * limit);
      nav.appendChild(pageButton);
   }

   //  Botón "Siguiente"
   const nextButton = document.createElement("button");
   nextButton.textContent = "Siguiente";
   nextButton.disabled = currentOffset + limit >= totalResults;
   nextButton.onclick = () => mostrarColeccion(categoria, currentOffset + limit);
   nav.appendChild(nextButton);
}

/**
 * Función para redirigir a la página de detalles del anime
 * @param {number} animeId - ID del anime
 */
function verAnime(animeId) {
   window.location.href = `anime.html?id=${animeId}`;
}

/**
 * Función para seleccionar elementos aleatorios de una lista
 * @param {Array} lista - Lista de animes obtenida de la API
 * @param {number} cantidad - Número de animes a seleccionar
 * @returns {Array} - Lista de animes aleatorios
 */
function seleccionarAleatorios(lista, cantidad) {
   const shuffled = lista.sort(() => 0.5 - Math.random());
   return shuffled.slice(0, cantidad);
}

// Función para traducir texto usando LibreTranslate
// async function traducirTexto(texto, source = "en", target = "es") {
//    try {
//       const res = await fetch("https://libretranslate.de/translate", {
//          method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify({
//             q: texto,
//             source,
//             target,
//             format: "text"
//          })
//       });

//       const data = await res.json();
//       return data.translatedText;
//    } catch (error) {
//       console.error("Error al traducir:", error);
//       return texto; // Fallback: mostrar original si falla
//    }
// }

// Exportamos funciones
export { buscarAnime, mostrarAnimes, obtenerColeccionAnimes, mostrarColeccion, seleccionarAleatorios };
