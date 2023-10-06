// ---- IMPORTS ---- //

// our main class
import View from './view';

// results dom element
import { RECIPE_UPLOAD } from '../config';
import { ADD_RECIPE_WINDOW } from '../config';
import { OVERLAY } from '../config';
import { OPEN_MODAL } from '../config';
import { CLOSE_MODAL } from '../config';

// ---- RESULTS VIEW CLASS ---- //

// child class of View
class addRecipeView extends View {
  _parentEl = RECIPE_UPLOAD;
  _message = 'Recipe uploaded successfully! :)';

  _window = ADD_RECIPE_WINDOW;
  _overlay = OVERLAY;
  _btnOpen = OPEN_MODAL;
  _btnClose = CLOSE_MODAL;

  // This show and hide window handler has no need to be placed in constructor so it goes here
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  /**
   * Toggles the overlay / class window from hidden to not
   * @returns nothing
   * @author ShAnder
   */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  /**
   * Handler to show the window
   * @returns nothing
   * @author ShAnder
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Handler to hide the window
   * @returns nothing
   * @author ShAnder
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Handler for uploading the recipe, function found in model.js, takes the
   * form data and spreads it into an array, then into a data object. Then
   * triggers the upload recipe with the data as an argument on submit click
   * @param {function} handler
   * @returns nothing
   * @author ShAnder
   */
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      // get our form data from parent el and spread it into an array
      const dataArray = [...new FormData(this)];
      // now convert to an object thanks to es2019
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
  _generateMarkup() {}
}

// export a new addRecipeView instance
export default new addRecipeView();
