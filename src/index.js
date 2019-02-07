// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", ()=>{
const quoteContainer = document.querySelector("#quote-list")
const URL = "http://localhost:3000/quotes"
let allQuotes = []
const newQuoteForm = document.querySelector("#new-quote-form")
const feelings = document.querySelector(".quote-card")



fetch (URL)
.then(r => r.json())
 .then(quotes =>  {
    let quoteInfo = quotes.map(function(quote){
      //allQuotes = quotes
      //console.log(quotes)
      return `
      <li class='quote-card'>
     <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id=${quote.id} class='btn-success'>Likes: <span >${quote.likes}</span></button>
      <button data-id=${quote.id} class='btn-danger'>Delete</button>
    </blockquote>
  </li>
      `
    })// end of map
    quoteContainer.innerHTML += quoteInfo.join('')
})//end of fetch

newQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault()
  //console.log(e.target)
  const quoteWords = document.querySelector('#new-quote').value

  const quoteAuthor = document.querySelector('#author').value
  //console.log(quoteWords, quoteAuthor);
fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    quote: quoteWords,
    author: quoteAuthor,
    likes: 0

  })
})
.then( r => r.json())
.then( newQuote => {
  let newQuoteHTML = `
    <li class='quote-card'>
   <blockquote class="blockquote">
    <p class="mb-0">${newQuote.quote}</p>
    <footer class="blockquote-footer">${newQuote.author}</footer>
    <br>
    <button data-id=${newQuote.id} class='btn-success'>Likes: <span >${newQuote.likes}</span></button>
    <button data-id=${newQuote.id} class='btn-danger'>Delete</button>
  </blockquote>
  </li>
    `
quoteContainer.innerHTML += newQuoteHTML
e.target.reset()
  })
})//end of newQuoteForm eventListener

//Delete deletes from DB and Dom
quoteContainer.addEventListener("click", (e)=> {
//console.log(e.target);
if (e.target.className === "btn-success"){
  let currentLikeString = e.target.innerText
  currentLikes = parseInt(currentLikeString.slice(7))
 currentLikes+=1
//console.log(currentLikes);
e.target.innerText = `Likes: ${currentLikes}`

fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    likes: currentLikes
  })
})
}


if(e.target.className === "btn-danger"){
  (e.target.parentElement.parentElement).remove()

  fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`,{
    method: "Delete"
  })
  .then(r => {
    e.target.parentElement.remove
   })
}

})//end quote container listenetr


//like increase # of likes





})//end DOMContentLoaded
