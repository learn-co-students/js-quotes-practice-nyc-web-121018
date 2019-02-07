let allQuotes = []

document.addEventListener('DOMContentLoaded', (e) => {

  let quoteStack = document.getElementById('quote-list')
  let quoteForm = document.getElementById('new-quote-form')
  let newQuote = document.getElementById('new-quote')
  let newAuthor = document.getElementById('author')
  let likeBtn = document.querySelectorAll('.btn-success')


  fetch('http://localhost:3000/quotes')
  .then(r => r.json())
  .then(quotes => {
    allQuotes = quotes
    const quoteHTML = quotes.map((quote) => {
      return renderQuoteHTML(quote)

    })//end of map
    // console.log(quoteHTML);
    quoteStack.innerHTML = quoteHTML.join('')
  })//end of fetch


  quoteForm.addEventListener('submit', e => {
    e.preventDefault()
    // console.log(newQuote.value, newAuthor.value);
    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: newQuote.value,
        likes: 0,
        author: newAuthor.value
      })
    }) // end of fetch
    .then(r => r.json()) // - updated the DB
    .then(patchedQuote => {
      // console.log(patchedQuote.author, patchedQuote.quote);
      quoteStack.innerHTML += renderQuoteHTML(patchedQuote)
      allQuotes.push(patchedQuote)
    }) // end of .then
  })//end of submit listener

  quoteStack.addEventListener('click', (e) => {
    e.preventDefault()
    if(e.target.innerText === "Delete"){
        // console.log(e.target.parentElement.id);
      fetch(`http://localhost:3000/quotes/${e.target.parentElement.id}`, {
        method: "DELETE",
      }) // end of fetch
      .then(r => {
        e.target.parentElement.parentElement.remove()
      })//end of .then
    }//end of DELETE if stmt

    if(e.target.className === "btn-success"){
      // console.log(e.target.firstElementChild.innerText);
      let span = e.target.firstElementChild
      let likeCount = e.target.firstElementChild.innerText
      // console.log(likeCount);
      let parsedSpan = parseInt(likeCount)
      parsedSpan += 1
      span.innerText = parsedSpan
      // console.log(parsedSpan);
      fetch(`http://localhost:3000/quotes/${e.target.parentElement.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: parsedSpan
        })
      })//end of fetch
    }//end of LIKE if stmt

    if(e.target.className === "btn-edit"){
      let foundQuote = allQuotes.find(quote => {
        return quote.id === parseInt(e.target.parentElement.id)
      })
      // console.log(foundQuote.quote);
      let editFormHTML =
      `
      <form id="edit-quote-form">
        <div class="form-group">
          <label for="edit-quote">Revised Quote</label>
          <input type="text" class="form-control" id="edit-quote" value="${foundQuote.quote}">
        </div>
        <div class="form-group">
          <label for="Author">Revised Author</label>
          <input type="text" class="form-control" id="author" value="${foundQuote.author}">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      `
      // console.log(e.target);
      e.target.parentElement.parentElement.innerHTML += editFormHTML
      let editForm = document.getElementById('edit-quote-form')
      // how do make this work???
      // if(editForm.style.display === "block"){
      //   editForm.style.display = "none"
      // } else {
      //   editForm.style.display = "block"
      // }
    }//end of EDIT if stmt

  })//end of quotestack listener

  const container = document.querySelector("#div-container")
  container.addEventListener('click', e => console.log(e))

quoteStack.addEventListener('submit', (e) => {
  console.log('click');
  if(e.target.id === 'edit-quote-form'){
      e.preventDefault()
      console.log('click');
  }

})


})//end of DOM loading

function renderQuoteHTML(quote){
  return `
  <li class='quote-card'>
  <blockquote id="${quote.id}" class="blockquote">
    <p class="mb-0" id="quotequote">${quote.quote}</p>
    <footer class="blockquote-footer" id="quoteauthor">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-edit'>Edit</button>
    <button class='btn-danger'>Delete</button>
  </blockquote>
</li>
  `
}//end of quote HTML rendering
