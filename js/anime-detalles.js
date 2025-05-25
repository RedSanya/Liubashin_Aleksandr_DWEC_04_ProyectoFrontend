import { handleSearch } from "./app.js";

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

async function obtenerAnimePorId(id) {
   const res = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
   const data = await res.json();
   return data.data;
}

function mostrarAnime(anime) {
   const linkStream = anime.attributes.url;
   console.log(linkStream);

   const container = document.getElementById("anime-detalle");
   const titulo = anime.attributes.titles.en || anime.attributes.titles.en_jp;
   const descripcion = anime.attributes.synopsis;
   const imagen = anime.attributes.posterImage.medium;
   const estado = anime.attributes.status || "Desconocido";
   const episodios = anime.attributes.episodeCount || "-";
   const duracion = anime.attributes.episodeLength ? anime.attributes.episodeLength + " min" : "-";
   const año = anime.attributes.startDate ? anime.attributes.startDate.slice(0, 4) : "-";
   const puntuacion = anime.attributes.averageRating || "N/A";
   const clasificacion = anime.attributes.ageRatingGuide || anime.attributes.ageRating || "";
   const rating = anime.attributes.popularityRank || "";
   const subtipo = anime.attributes.subtype || "N/A";
   const fechaInicio = anime.attributes.startDate || "?";
   const fechaFin = anime.attributes.endDate || "?";
   const youtubeId = anime.attributes.youtubeVideoId;

   document.title = titulo;

   container.innerHTML = `
    <div class="anime-info-box">
      <div class="cover">
        <img src="${imagen}" alt="${titulo}" />
        <span class="episodios-label">${episodios} episodios</span>
      </div>

      <div class="info">
        <h1>${titulo}</h1>
        <ul>
          <li><strong>Año:</strong> ${año}</li>
          <li><strong>Duración:</strong> ${duracion}</li>
          <li><strong>Estado:</strong> ${estado}</li>
          <li><strong>Puntuación:</strong> ${puntuacion}</li>
          <li><strong>Rating:</strong> ${rating}</li>
          <li><strong>Subtipo:</strong> ${subtipo}</li>
          <li><strong>Fecha inicio:</strong> ${fechaInicio}</li>
          <li><strong>Fecha fin:</strong> ${fechaFin}</li>
          <li><strong>Clasificación:</strong> ${clasificacion}</li>
        </ul>
        <button class="ver-ahora" onclick="document.getElementById('reproductor').scrollIntoView({behavior: 'smooth'})">Ver ahora</button>
      </div>
    </div>
            <p class="descripcion">${descripcion}</p>
  `;

   const reproductor = document.getElementById("reproductor");

   if (youtubeId) {
      reproductor.innerHTML += `
      <iframe width="60%" height="480" src="https://www.youtube.com/embed/${youtubeId}" 
        frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
      </iframe>
    `;
   } else {
      reproductor.innerHTML += "<p>Trailer no disponible.</p>";
   }
}

obtenerAnimePorId(animeId)
   .then(anime => mostrarAnime(anime))
   .catch(err => {
      document.getElementById("anime-detalle").innerHTML = "<p>Error al cargar los detalles del anime.</p>";
      console.error(err);
   });

