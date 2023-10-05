// ---- IMPORTS ---- //

//Images for html
import icons from 'url:../../img/icons.svg';

// Export the class for child classes
export default class View {
  _data;

  /**
   * Clears the inner HTML of the parent element (element dicteted by whichever view is calling it)
   * then insert the markup that's passed through as new HTML after the start
   * @param {string} markup the markup string passed into the function
   * @this {Object} View instance
   * @author ShAnder
   */
  _clear(markup) {
    // clear parent el html
    this._parentEl.innerHTML = '';
    // insert new markup
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders the received object to the DOM or creates a markup string
   * @param {Object | Object[]} data the data to be rendered (eg recipe, bookmarks ect)
   * @param {boolean} [render=true ] If true render to DOM, if false create markup to be used elsewhere
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View Instance
   * @author ShAnder
   */
  render(data, render = true) {
    // check if we have data / data is array and length is not 0
    if (!data || (Array.isArray(data) && data.length === 0))
      // if fail return error
      return this.renderError();
    // else set data
    this._data = data;
    const markup = this._generateMarkup();
    // return markup then clear
    if (!render) return markup;
    this._clear(markup);
  }

  /**
   * Algorithm / function to update the dom, compares the data passed in with current element
   * manipulates them using array methods and then updates the differences on the current markup
   * with the new element changes
   * @param {string} data The data coming in is a markup string for comparison
   * @returns nothing, does not return only manipulates data
   * @this {Object} View instance
   * @author ShAnder
   */
  update(data) {
    this._data = data;
    // get new markup from data
    const newMarkup = this._generateMarkup();
    // create new dom element from markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // get new and cur elements from markup and parent element
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    // loop over and compare
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // if new data, update
      if (
        !newEl.isEqualNode(curEl) &&
        // get node value (first child) and trim
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // check for updated attributes
      if (!newEl.isEqualNode(curEl)) {
        // convert to an array and set the attr name and value
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  /**
   * Renders an html markup block to serve as a render message
   * @param {string} message message to be displayed as error, comes from child class
   * @returns nothing, does not return only manipulates data
   * @this {Object} View instance
   * @author ShAnder
   */
  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
              <div>
                  <svg>
                      <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
              </div>
          <p>${message}</p>
          </div>`;

    this._clear(markup);
  }

  /**
   * Renders an html markup block to serve as a render message
   * @param {string} message message to be displayed on success, comes from child class
   * @returns nothing, does not return only manipulates data
   * @this {Object} View instance
   * @author ShAnder
   */
  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
              <div>
                  <svg>
                      <use href="${icons}#icon-smile"></use>
                  </svg>
              </div>
              <p>${message}</p>
          </div>`;

    this._clear(markup);
  }

  /**
   * Renders an html markup block to serve as a loading spinner
   * @returns nothing, does not return only manipulates data
   * @this {Object} View instance
   * @author ShAnder
   */
  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
      `;
    this._clear(markup);
  }
}
