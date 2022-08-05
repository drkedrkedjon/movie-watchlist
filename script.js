const searchField = document.querySelector('#search-field');
const searchBtn = document.querySelector('#search-btn')
const mainContainer = document.querySelector('#main-container')
const cardRemoveBtn = document.querySelector('#card-remove-btn')
const modal = document.querySelector('#modal') 
let watchlistArray = []

// Ver si hay data en Local Storage y si es si, cargar nuestro array con su contenido
const loadLocalStorage = JSON.parse( localStorage.getItem('myWatchlist') )
loadLocalStorage ? watchlistArray = loadLocalStorage : watchlistArray

// Obtener el termino de busqueda con un EventListener en el botton search
searchBtn.addEventListener('click', searchMovies)
function searchMovies() {
  const searchInput = searchField.value
  // Llamamos fetchData para obtener resultados pasando como argumentos .value y tipo de busqueda
  fetchData(searchInput, 's')
   // Pasar data devuelta a function de generar HTML
  .then(data => getSearchHTML(data.Search))
}

// Function que obtiene data desde API utilizando fetch
async function fetchData(searchInput, type) {
  // Bloque try/catch para captar errores
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=b4ee78c6&${type}=${searchInput}`)
    const data = await res.json()
    // Condicional que capta errores de busqueda devueltos por API
    if(data.Response === 'False') {
      mainContainer.innerHTML = `<p>${data.Error}</p>`
    } else {
      return data
    }
  } catch (err) {
    // Bloque catch para captar errores 200
    mainContainer.innerHTML = `<p>Sorry, looks like we have a following problem: ${err}</p>`
  }
}

// Para generar codigo HTML para render data de la busqueda
function getSearchHTML(data) {
  // Hacemos un .map que devuelve codigo HTML en una array y con .join lo unimos en una string
  const searchHTML = data.map(
    singleMovie => {
      return `
        <section class="search-card">
          <div>
            <div class="search-card-poster"><img src="${singleMovie.Poster}" alt="Movie Poster"></div>
          </div>
          <div class="search-card-meta">
            <button id="card-details-btn" class="search-card-btn" data-title="${singleMovie.Title}" >Get details ...</button>
            <h2>${singleMovie.Title}</h2>
            <p><span>${singleMovie.Type}</span> (<span>${singleMovie.Year}</span>)</p>
          </div>
        </section>
      `
    }
    ).join('')
    // Llamamos la function para render HTML en el navegador y le pasamo HTML como argumento
    renderHTML(searchHTML)
    // Despues de generar los botones (+ Watchlist) llamamos esta funtion para anadir eventListeners
    addEventsBtnDetail()
}

// Para render HTML en navegador
function renderHTML(searchHTML) {
  mainContainer.innerHTML = searchHTML
}

// Function que anade eventListener a todos los botones (+ Watchlist)
function addEventsBtnDetail() {
  // Nos amaramos a los bottones y la HTMLColection convertimos en un array via ...spread operator
  const allDetailsBtn = document.querySelectorAll('#card-details-btn')
  const btnArray = [...allDetailsBtn]
  // Hacemos un .map encima de array
  btnArray.map(
    btn => btn.addEventListener('click', () => {
      // Fetch data de servidor via titulo de la peli y el tipo de la busqueda como argumentos
      fetchData(btn.dataset.title, 't')
      .then(data => {
        // Llamamos la functio quer genera HTML de la vista detallada
        getDetailsHTML(data)
        // Abrimos un modal y presentamos una vista detallada
        modal.showModal()
        const closeModalBtn = document.querySelector('#close-modal-btn')
        // Botton de cerrar el modal
        closeModalBtn.addEventListener('click', () => modal.close())
        // Botton de anadir la peli a Watchlist
        const cardAddBtn = document.querySelector('#card-add-btn')
        // FUncionalidad del mismo button donde empujamos la peli en una array y luego guardamos esta array en local storage
        cardAddBtn.addEventListener('click', () => {
          watchlistArray.push(data)
          window.localStorage.setItem('myWatchlist', JSON.stringify(watchlistArray))
        })
        })
      }
    )
  )
}

// Render HTML de la vista detallada en el navegador
function getDetailsHTML(data) {
  modal.innerHTML = `
    <section class="card">
      <div class="card-poster"><img src="${data.Poster}" alt="Movie Poster"></div>
      <div class="card-meta">
        <div class="card-title">
          <h2>${data.Title}</h2>
          <p>⭐️ <span>${data.imdbRating}</span></p>
        </div>
        <div class="card-details">
          <p>${data.Runtime}</p>
          <p>${data.Genre}</p>
          <button id="card-add-btn" class="card-btn"><span>+</span> Watchlist</button>
        </div>
        <div class="card-synopsis">
          <p>${data.Plot}</p>
        </div>
      </div>
      <button id="close-modal-btn" class="close-modal-btn">Close</button>
    </section>
  `
}

  
  
