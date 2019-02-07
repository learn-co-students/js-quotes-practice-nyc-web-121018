// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', () => {

  const quoteList = document.querySelector('#quote-list')
  const newQuoteForm = document.querySelector('#new-quote-form')

  fetchQuotes()

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault();
    let quote = e.target.querySelector('#new-quote').value
    let author = e.target.querySelector('#author').value

    fetch('http://localhost:3000/quotes', {
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
    }) // end of POST fetch
    .then(r => r.json())
    .then(newQuote => {
      fetchQuotes();
      newQuoteForm.reset();
    })
  }) // end of form EventListener

  quoteList.addEventListener('click', e => {
    if (e.target.innerText === 'Delete') {
      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
        method: "DELETE"
      })// end of DELETE fetch
      .then(r => fetchQuotes())
    }

    if (e.target.className === 'btn-success') {
      e.target.firstElementChild.innerText = parseInt(e.target.firstElementChild.innerText) + 1

      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: e.target.firstElementChild.innerText
        })
      })
    }
  })

  function fetchQuotes() {
    fetch('http://localhost:3000/quotes')
      .then(r => r.json())
      .then(quotes => renderAllQuotes(quotes))
  }

  function renderQuote(quote) {
    return `
    <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button data-id=${quote.id} class='btn-danger'>Delete</button>
      </blockquote>
    </li>`
  }

  function renderAllQuotes(quotes) {
    return quoteList.innerHTML = quotes.map(renderQuote).join('')
  }

}) // end of DOMContentLoaded
