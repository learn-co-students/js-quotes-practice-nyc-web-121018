let allQuotes = []
const url = "http://localhost:3000/quotes"
let quoteList
let newQuoteForm

function apiGet() {
  fetch(url)
    .then(r => {
      return r.json()
    })
    .then(r => {
      allQuotes = r
    })
    .then(r => {
      showQuotes(allQuotes)
    })
}

function apiPatch(id, quote, likes, author) {
  fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: quote,
        likes: likes,
        author: author
      })
    })
    .then(r => {
      return r.json()
    })


}

function apiCreate(quote, author) {
  fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: quote,
        likes: 0,
        author: author
      })
    })
    .then(r => {
      return r.json()
    })

    .then(r => {
      allQuotes.push(r)
      addQuoteToDom(r)
    })
}

function apiDelete(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE"
  })

}






function getQuoteById(id) {
  let found = allQuotes.find(element => {
    return element.id == id
  })
  return found
}

function getQuoteDomObject(id) {
  return document.querySelector(`#quote-${id}`)
}

function addQuoteToDom(quote){

  quoteList.innerHTML +=

  `<li id="quote-${quote.id}" class='quote-card'>
  <blockquote class="blockquote">
  <p class="mb-0">${quote.quote}</p>
  <footer class="blockquote-footer">${quote.author}</footer>
  <br>
  <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
  <button data-id=${quote.id} class='btn-danger'>Delete</button>
  </blockquote>
  </li>
  `
}

function replaceQuote(quoteObject) {
  getQuoteDomObject(quoteObject.id).innerHTML =

    `
  <blockquote class="blockquote">
    <p class="mb-0">${quoteObject.quote}</p>
    <footer class="blockquote-footer">${quoteObject.author}</footer>
    <br>
    <button data-id=${quoteObject.id} class='btn-success'>Likes: <span>${quoteObject.likes}</span></button>
    <button data-id=${quoteObject.id} class='btn-danger'>Delete</button>
  </blockquote>
  `
}

function showQuotes(quotes) {
  for (let quote of quotes) {
    quoteList.innerHTML +=

      `<li id="quote-${quote.id}" class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button data-id=${quote.id} class='btn-danger'>Delete</button>
  </blockquote>
</li>
  `
  }
}

function like(id) {
  let quote = getQuoteById(id)
  apiPatch(id, quote.quote, ++quote.likes, quote.author)
  replaceQuote(quote)


}

document.addEventListener('DOMContentLoaded', event => {

  newQuoteForm = document.querySelector(`#new-quote-form`)

  quoteList = document.querySelector(`#quote-list`)
  apiGet()

  quoteList.addEventListener('click', e => {
    let id = e.target.dataset.id

    if (e.target.className === "btn-success") {

      like(id)
    }

    if (e.target.className === "btn-danger") {

      apiDelete(id)
      getQuoteDomObject(id).remove()
    }

  })

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target);
    let quote = document.querySelector(`#new-quote`).value
    let author = document.querySelector(`#author`).value

    apiCreate(quote, author)
    e.target.reset()
  })








})
