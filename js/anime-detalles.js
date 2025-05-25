
const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

async function obtenerAnimePorId(id) {
   const res = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
   const data = await res.json();
   return data.data;
}

function mostrarAnime(anime) {
   const container = document.getElementById("anime-detalle");
   const titulo = anime.attributes.titles.en || anime.attributes.titles.ja_jp;
   const descripcion = anime.attributes.synopsis;
   const imagen = anime.attributes.posterImage.original;

   //Cambiar el título del documento
   document.title = titulo;

   container.innerHTML = `
    <h1>${titulo}</h1>
    <img src="${imagen}" alt="${titulo}" style="width: 200px; border-radius: 10px;">
    <p style="margin-top: 1rem;">${descripcion}</p>
  `;

   document.getElementById("reproductor").innerHTML = `
    <h2>Reproductor</h2>
    <iframe src="https://kodiklive.net/embed/${animeId}" width="100%" height="480" allowfullscreen frameborder="0"></iframe>
  `;
}

obtenerAnimePorId(animeId)
   .then(anime => mostrarAnime(anime))
   .catch(err => {
      document.getElementById("anime-detalle").innerHTML = "<p>Error al cargar los detalles del anime.</p>";
      console.error(err);
   });
