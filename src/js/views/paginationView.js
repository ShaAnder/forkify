// ---- IMPORTS ---- //

// our main class
import View from './view';

// results dom element
import { PAGINATION } from '../config';

// our icons
import icons from 'url:../../img/icons.svg';

// ---- RESULTS VIEW CLASS ---- //

// PaginationView Child class controls how our buttons are made
class PaginationView extends View {
  _parentEl = PAGINATION;

  /**
   * Handler for clicking the pages, listens for a click and gets the closest parent element
   * (btn) then passes the new page number (what was clicked) as an arg back to the function
   * so that it can render the new page
   * @param {function} handler
   * @returns nothing, or guards / stops func if no button
   * @author ShAnder
   */
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      // event delegation to get closest element(btn) clicked
      const btn = e.target.closest('.btn--inline');
      // guard clause in case no button
      if (!btn) return;
      // look for the btn dataset and store it for passing back to fn
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  /**
   * Generate our buttons markup for our pages, gets the current page and amount of pages
   * based on the results of the num pages formula generates the buttons we use based on conditional
   * args
   * @returns {string} markup string of our buttons
   * @author ShAnder
   */
  _generateMarkup() {
    // get our cur page
    const curPage = this._data.page;
    // get number of pages but dividing results by per page number (in config)
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Now if checks based on what pages we want to see

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
