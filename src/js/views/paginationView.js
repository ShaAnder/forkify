// ---- IMPORTS ---- //

// our main class
import View from './view';

// results dom element
import { PAGINATION } from '../config';

// our icons
import icons from 'url:../../img/icons.svg';

// ---- RESULTS VIEW CLASS ---- //

class PaginationView extends View {
  _parentEl = PAGINATION;

  // now we need more subscriber / publisher stuff here, we want to create a
  // function to handle the swapping between the button clicks

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      // now we need to do event delegation to get the closest button to the clicked
      const btn = e.target.closest('.btn--inline');
      // we're searching for all the children of the btn--inline to ensure if we missclick
      // it will still go through (if it's close)

      // guard clause in case no button
      if (!btn) return;

      // we look for our data here and store it in a const for later
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // get our cur page
    const curPage = this._data.page;
    // firs let's get the number of pages, it gets the results and divides it by oure resperpage (10)
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // NOW we run some checks to see if we are on a certain page

    // As well as this we need to add in a data attribute to the html, this is a persistent piece
    // that allows us or js rather to know where to go for the button moving, cos while we CAN
    // nav between buttons it doesn't know right now. All we do is set it to the same as the current page + or - 1

    // Page 1, there are other pages
    if (curPage === 1 && numPages > 1) {
      // now return rendered buttons
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>
  `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      // now return rendered buttons
      return `          
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;
    }

    // Other page
    if (curPage < numPages && curPage !== 1) {
      // now return rendered buttons
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>
      `;
    }
    // Page 1, and no other pages
    return '';
  }
}

export default new PaginationView();
