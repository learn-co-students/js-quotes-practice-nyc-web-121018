// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () =>{
const quoteContainer = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

fetch("http://localhost:3000/quotes")
  .then(r => r.json())
  .then(quoteData =>{
    quoteHTML = quoteData.map(quote =>{
      return `
      <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id=${quote.id}>Likes: ${quote.likes}<span>0</span></button>
      <button class='btn-danger' data-id=${quote.id}>Delete</button>
    </blockquote>
    </li>
      `
    })//end map
    quoteContainer.innerHTML += quoteHTML.join('')
  })//end then

  newQuoteForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    //console.log(e.target);
    const quoteWords = document.querySelector('#new-quote').value
    const quoteAuthor = document.querySelector('#author').value
    console.log(quoteWords, quoteAuthor)

    fetch("http://localhost:3000/quotes", {
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
      .then(r => r.json())
      .then(newQuote =>{
      let newQuoteHTML = `
        <li class='quote-card'>
        <blockquote class="blockquote">
        <p class="mb-0">${newQuote.quote}</p>
        <footer class="blockquote-footer">${newQuote.author}</footer>
        <br>
        <button class='btn-success' data-id=${newQuote.id}>Likes: ${newQuote.likes}<span>0</span></button>
        <button class='btn-danger' data-id=${newQuote.id}>Delete</button>
      </blockquote>
      </li>
          `
          quoteContainer.innerHTML += newQuoteHTML

        })//end then

  })//end addEventListener
  quoteContainer.addEventListener("click", (e)=>{
   if(e.target.className === "btn-success"){
     let currentLikeString = e.target.innerText
      let currQuoteLikeId = e.target.dataset.id
      //console.log(currQuoteLikeId);
      let currentLikes = parseInt(currentLikeString.slice(7))
    currentLikes+=1
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

  })//end add event






})//end DOMContentLoaded
