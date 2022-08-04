const searchField = document.querySelector('#search-field');
const searchBtn = document.querySelector('#search-btn')
const mainContainer = document.querySelector('#main-container')
const cardRemoveBtn = document.querySelector('#card-remove-btn')
const modal = document.querySelector('#modal') 
let watchlistArray = []

// Ver si hay data en Local Storage y si es si, cargar nuestro array con su contenido
const loadLocalStorage = JSON.parse( localStorage.getItem('myWatchlist') )
loadLocalStorage ? watchlistArray = loadLocalStorage : watchlistArray

// Obtener el termino de busqueda
searchBtn.addEventListener('click', searchMovies)
function searchMovies() {
  const searchInput = searchField.value
  fetchData(searchInput, 's')
  .then(data => getSearchHTML(data.Search))
}


// Function que obtiene data desde API utilizando fetch
async function fetchData(searchInput, type) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=b4ee78c6&${type}=${searchInput}`)
    const data = await res.json()
    // Condicional que capta errores de busqueda
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

function renderHTML(searchHTML) {
  mainContainer.innerHTML = searchHTML
}

// Despues de render codigo HTML con resultados de la busqueda
function addEventsBtnDetail() {
  const allDetailsBtn = document.querySelectorAll('#card-details-btn')
  const btnArray = [...allDetailsBtn]
  btnArray.map(
    btn => btn.addEventListener('click', () => {
      fetchData(btn.dataset.title, 't')
      .then(data => {
        getDetailsHTML(data)
        modal.showModal()
        const closeModalBtn = document.querySelector('#close-modal-btn')
        closeModalBtn.addEventListener('click', () => modal.close())
        const cardAddBtn = document.querySelector('#card-add-btn')
        cardAddBtn.addEventListener('click', () => {
          watchlistArray.push(data)
          window.localStorage.setItem('myWatchlist', JSON.stringify(watchlistArray))
        })
        })
      }
    )
  )
}

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

function getSearchHTML(data) {
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
    renderHTML(searchHTML)
    addEventsBtnDetail()
  }
  
  
