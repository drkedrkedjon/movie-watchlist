const watchlistContainer = document.querySelector('#watchlist-container')
let watchList = []

// Aqui cargamos watchlist desde local storage (si hay)
function loadWatchlistFromStorage() {
  const fromLocal = window.localStorage.getItem('myWatchlist')
  watchList = JSON.parse(fromLocal)
  // Llamamos la funcion que genera HTML pasando watchlist como argumento
  getHTML(watchList)
}

// Sirve para generar HTML con el contenido de watchlist
function getHTML(watchList) {
  // Hacemos un .map() sobre watchlist
  const html = watchList.map( movie => {
    return `
    <section class="card-watchlist-page">
    <div class="card-poster"><img src="${movie.Poster}" alt="Movie Poster"></div>
    <div class="card-meta">
      <div class="card-title">
        <h2>${movie.Title}</h2>
        <p>⭐️ <span>${movie.imdbRating}</span></p>
      </div>
      <div class="card-details">
        <p>${movie.Runtime}</p>
        <p>${movie.Genre}</p>
        <button id="card-remove-btn" data-movie-title="${movie.Title}" class="card-btn"><span class="red">-</span> Remove</button>
      </div>
      <div class="card-synopsis">
        <p>${movie.Plot}</p>
      </div>
    </div>
  </section>
  <hr>
    `
  } ).join('')
  // Render HTML en el navegador
  watchlistContainer.innerHTML = html
  // Despues de crear botones de remove from watchlist les añadimos eventListener
  removeBtnEventListeners()
}

// Añadir eventListener a botones de remove
function removeBtnEventListeners() {
  // Creamos una HTML coclection
  const btnColection = document.querySelectorAll('#card-remove-btn')
  // La expandimos en un array con spread operator
  const btnArray = [...btnColection]

  btnArray.map( btn => {
    btn.addEventListener('click', () => {
      // Usamos el atributo data- de HTML para usar su valor para eliminar la peli desde watchlist y local storage
      const btnData = btn.getAttribute('data-movie-title')
      // Encontramos indice de nuestra peli
      const indice = watchList.findIndex( movie => movie.Title === btnData)
      // Eliminamos la peli usando aplice()
      watchList.splice(indice, 1)
      // Guardamos la nueva watchlist de nuevo en local storage
      window.localStorage.setItem('myWatchlist', JSON.stringify(watchList))
      // Cargamos la watchlist desde local storage de nuevo.
      loadWatchlistFromStorage()

    }) 
  } )
}

loadWatchlistFromStorage()