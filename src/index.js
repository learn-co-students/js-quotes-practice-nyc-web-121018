// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteContainer = document.querySelector("#quote-list")
let allQuotes = []

 document.addEventListener("DOMContentLoaded", function(event) {
   getQuotes()
   createNewQuote()
   buttonActions()

 }) // end DOM

 // Render all quotes from API
  function getQuotes(){
   fetch("http://localhost:3000/quotes")
   .then ( response => response.json())
   .then ( quotes => quotes.map(function(quote) {
     allQuotes = quotes
     let quoteHTML = quoteContainer.innerHTML +=
     ` <li class='quote-card'>
       <blockquote class="blockquote">
       <p class="mb-0">"${quote.quote}"</p>
       <footer class="blockquote-footer">${quote.author}</footer>
       <p>
       <button class='btn-success' data-id="${quote.id}"> Likes <span>${quote.likes}</span></button>
       <button class='btn-danger' data-id="${quote.id}">Delete</button>
       </blockquote>
       </li> `
     }))
   } // end getQuotes


   // OPTIMISTICALLY RENDERS
   // Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page.
   function createNewQuote(){
   const newForm = document.querySelector("#new-quote-form")

   newForm.addEventListener("submit", e => {
     e.preventDefault()
     let newQuote = newForm.querySelector("#new-quote").value
     let newAuthor = newForm.querySelector("#author").value
     console.log(newQuote, newAuthor)

    fetch ("http://localhost:3000/quotes", {
      method: "POST",
      body: JSON.stringify({
        quote: newQuote,
        author: newAuthor,
        likes: 0
      }),
        headers: {
         "Content-Type": "application/json",
          Accept: 'application/json'
        }
    })

    .then( response => response.json())
    .then( quote => {
      quoteContainer.innerHTML += `
      <li class='quote-card'>
        <blockquote class="blockquote">
        <p class="mb-0">"${quote.quote}"</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <p>
        <button class='btn-success' data-id="${quote.id}"> Likes <span class="likes">${quote.likes}</span></button>
        <button class='btn-danger' data-id="${quote.id}">Delete</button>
        </blockquote>
        </li>
      `
    })
    e.target.reset()
  }) // end form eventlistener
    } //end NewQuote

// Clicking the delete button should delete the respective quote from the database and remove it from the page without having to refresh.
    function buttonActions(){
    quoteContainer.addEventListener('click', e =>{
      if (e.target.className === 'btn-success'){
        let currentLikes = parseInt(e.target.innerText.split(" ")[1])
        let newLikes = currentLikes + 1
        console.log(newLikes)
        e.target.innerText = `Likes: ${newLikes}`
        fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`,{
          method: "PATCH",
          headers:{
            "Content-Type" : "application/json",
            "Accept" : "application/json"
          },
          body: JSON.stringify({
            likes: newLikes
            })
          })
      }

      if (e.target.className === 'btn-danger'){

        fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`,{
             method: "DELETE"
           }).then(r => e.target.parentElement.parentElement.remove())
         }

       }) // edit button Event listener

    } // end button Action
