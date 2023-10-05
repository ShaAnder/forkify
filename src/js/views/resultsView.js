// ---- IMPORTS ---- //

// classes
import View from './view';
import previewView from './previewView';

// results dom element
import { RESULTS } from '../config';

// our icons
import icons from 'url:../../img/icons.svg';

// ---- RESULTS VIEW CLASS ---- //

class ResultsView extends View {
  _parentEl = RESULTS;
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _message = '';

  // this gets the data from render, which in turn gets it from the controller
  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
}

export default new ResultsView();
