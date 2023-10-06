// ---- IMPORTS ---- //

// search dom
import { SEARCH } from '../config';
import View from './view';

// ---- SEARCH VIEW CLASS ---- //

// Extends from parent class view
class SearchView extends View {
  //Set the parent element to the search bar
  _parentEl = SEARCH;

  /**
   * Get query function, returns the value of the search query in the search bar
   * @returns value that we request from the search bar
   * @this {Object} View instance
   * @author ShAnder
   */
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  /**
   * Clears teh parent element
   * @returns Nothing
   * @this {Object} View instance
   * @author ShAnder
   */
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  /**
   * Adds a handler for subscriber publisher function, this handles and executes
   * the function it's tied to in controller when the event condition is met
   * @returns Nothing
   * @param {handler} function whichever function is passed into it
   * @this {Object} View instance
   * @author ShAnder
   */
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

// Export the search view
export default new SearchView();
