// ---- IMPORTS ---- //

// our main class
import View from './view';

// results dom element
import { RECIPE_UPLOAD } from '../config';
import { ADD_RECIPE_WINDOW } from '../config';
import { OVERLAY } from '../config';
import { OPEN_MODAL } from '../config';
import { CLOSE_MODAL } from '../config';

// our icons
import icons from 'url:../../img/icons.svg';

// ---- RESULTS VIEW CLASS ---- //

class addRecipeView extends View {
  _parentEl = RECIPE_UPLOAD;
  _message = 'Recipe uploaded successfully! :)';

  _window = ADD_RECIPE_WINDOW;
  _overlay = OVERLAY;
  _btnOpen = OPEN_MODAL;
  _btnClose = CLOSE_MODAL;

  // addHandlerShowWindow has nothing to do with any controller
  // so we're actually going to add it here
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //we want our publisher handler here
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

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

export default new addRecipeView();
