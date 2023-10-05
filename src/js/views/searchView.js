// ---- IMPORTS ---- //

//we want to import our dist images from parcel

// icons
import icons from 'url:../../img/icons.svg';
import { mark } from 'regenerator-runtime';

// search dom
import { SEARCH } from '../config';
import View from './view';

// ---- SEARCH VIEW CLASS ---- //

class SearchView extends View {
  //Set the parent element to the search bar
  _parentEl = SEARCH;

  // now we want to get the value from the search field, we do this by returning the value
  // this could have been done in controller, but the controller is not responsible for that
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // we now want to clear an input when someone hits submit
  //(this is diff to clear from parent as we are clearing a diff field)
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // and now more subscriber publisher method, we want to pass this to the controller
  // whenever a search submit field is hit
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
