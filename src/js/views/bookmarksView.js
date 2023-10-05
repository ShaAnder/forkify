// ---- IMPORTS ---- //

// our main class
import View from './view.js';
import previewView from './previewView.js';

// results dom element
import { BOOKMARKS } from '../config.js';

// our icons
import icons from 'url:../../img/icons.svg';

// ---- RESULTS VIEW CLASS ---- //

class BookmarksView extends View {
  _parentEl = BOOKMARKS;
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // this gets the data from render, which in turn gets it from the controller
  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
}

export default new BookmarksView();
