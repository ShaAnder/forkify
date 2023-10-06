// ---- IMPORTS ---- //

// classes
import View from './view';
import previewView from './previewView';

// results dom element
import { RESULTS } from '../config';

// ---- RESULTS VIEW CLASS ---- //

// results view class
class ResultsView extends View {
  _parentEl = RESULTS;
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _message = '';

  /**
   * (selected)view.render takes the data and then passes it through generate markup
   * which returns the data manipulated how we need. In this case creates a new arr
   * from the previewView and jins it as a string
   * @returns {this._data} data manipulated into a string for insertion
   * @this {Object} View instance
   * @author ShAnder
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
// export new (and only) instance of results view
export default new ResultsView();
