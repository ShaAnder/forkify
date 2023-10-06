// ---- IMPORTS ---- //

// our main class
import View from './view';

// our icons
import icons from 'url:../../img/icons.svg';

// ---- PREVIEW VIEW CLASS ---- //

// PreviewView child class, class that controls markup for rendered recipes
// Exists so we don't have to do duplicate code can just use it in results / bookmarks
class PreviewView extends View {
  _parentEl = '';

  /**
   * Generate markup designed for rendering bookmarks and results, created a view for it here
   * instead of using duplicate code, takes an object of data and using template literals inserts
   * it into the html element. Accomplished using class inheritance ex chain:
   * bookmarks -> here -> render -> handler -> publisher
   * @param {data object} result object containing our recipe data for parsing into the markup
   * @returns a markup string for placing into the html
   * @author ShAnder
   */
  _generateMarkup(result) {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
            <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
            </figure>
            
            <div class="preview__data">
              <h4 class="preview__title">${this._data.title}</h4>
              <p class="preview__publisher">${this._data.publisher}</p>
              <div class="preview__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
        </a>
    </li>
    `;
  }
}

// export single instance for use across application
export default new PreviewView();
