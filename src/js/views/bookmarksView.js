// ---- IMPORTS ---- //

// our main class
import View from './view.js';
import previewView from './previewView.js';

// results dom element
import { BOOKMARKS } from '../config.js';

// ---- RESULTS VIEW CLASS ---- //

// bookmarks class that extends from view
class BookmarksView extends View {
  _parentEl = BOOKMARKS;
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  /**
   * Handler for bookmarks, waits for the load event to trigger then loads bookmarks
   * @returns nothing
   * @author ShAnder
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /**
   * Generates bookmark markup, same as results, data is passed into the render function
   * (inherited from view), passed through this and returned as a new formatted string
   * @returns {this._data} manipulated data for the bookmarks dropdown bar
   * @author ShAnder
   */
  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
}

// export a new default bookmarks view instance
export default new BookmarksView();
