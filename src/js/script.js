/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
  const select = {
    books: {
      bookImage: '.book__image',
      bookImageId: 'data-id',
      bookRating: 'book__rating__fill',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    templateOf: {
      bookTemplate: '#template-book',
    },
  };

  const templates = {
    bookCard: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class Books{
    constructor(){
      const thisBook = this;

      thisBook.renderBooks();
      thisBook.initActions();
    }

    renderBooks(){
      const thisBook = this;
      thisBook.data = dataSource.books;

      for (const book of thisBook.data) {
        book.ratingBgc = thisBook.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.bookCard(book);
        const singleBook = utils.createDOMFromHTML(generatedHTML);
        const listOfBooks = document.querySelector(select.containerOf.booksList);
        listOfBooks.appendChild(singleBook);
      }
    }
    initActions(){
      const favoriteBooks = [],
        filters = [];

      const bookList = document.querySelectorAll(select.books.bookImage);
      for (let book of bookList){
        book.addEventListener('dblclick', function(event){
          if(event.target.offsetParent.classList.contains('book__image')){
            event.preventDefault();
            const targetBook = book.getAttribute(select.books.bookImageId);

            book.classList.toggle('favorite');
            favoriteBooks.push(targetBook);
          } 
        });
      }

      const booksFilter = document.querySelector(select.containerOf.filters);
      
      booksFilter.addEventListener('click', function(event){
        if(event.target.tagName == 'INPUT' && event.target.type == 'checkbox' && event.target.name == 'filter'){
          const value = event.target.value;
          const checked = event.target.checked;
          if (checked ) {
            filters.push(value);
          } else {
            filters.splice(filters.indexOf(value), 1);
          }
        }
        filterBooks();
      });
      function filterBooks(){
        for(let book of dataSource.books){
          let shouldBeHidden = false;
          for(const filter of filters){
            if(!book.details[filter]){
              shouldBeHidden = true;
              break;
            }
          }
          const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');
    
          if(shouldBeHidden == true){
            bookImage.classList.add('hidden');
          } else {
            bookImage.classList.remove('hidden');
          }
        }
      }
      
    }
    determineRatingBgc(rating) {
      const thisBooksList = this;

      thisBooksList.ratingBgc = '';

      if (rating < 6) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%';
      } else if (rating > 6 && rating <= 8) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%';
      } else if (rating > 8 && rating <= 9) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%';
      } else if (rating > 9) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%';
      }

      return thisBooksList.ratingBgc;
    } 
  }

  const app = new Books();
  console.log(app);
}