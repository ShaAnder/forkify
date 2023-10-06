// ---- IMPORTS ---- //

//we want to import our dist images from parcel

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

// parent class
import View from './view.js';

// ---- RECIPE VIEW CLASS ---- //

// Recipe view child class, responsible for generating the recipe preview window
class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage = 'Cannot find recipe, please try again!';
  _message = '';

  /**
   * Handler for dealing with hashchanges in the url
   * @param {function} handler
   * @returns nothing
   * @author ShAnder
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  /**
   * Handler for updating the servings of the recipe, responsible for making sure that the html is
   * up to date and numbers are modified accordingly
   * @param {function} handler
   * @returns nothing / cancels function if guard clause triggers
   * @author ShAnder
   */
  addHandlerUpdateServings(handler) {
    // event listener for button clicks
    this._parentEl.addEventListener('click', function (e) {
      // closest parent
      const btn = e.target.closest('.btn--update-servings');
      // Guard clause
      if (!btn) return;
      // update the dataset values for serving numbers
      const { updateTo } = btn.dataset;
      // make sure user cannot go into - servings
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  /**
   * Handler for adding the recipe to the bookmarks, this could be in the bookmarks view but
   * works and is kind of relevant here too so no need to move
   * @param {function} handler
   * @returns a markup string for placing into the html
   * @author ShAnder
   */
  addHandlerAddBookmark(handler) {
    // listen for click
    this._parentEl.addEventListener('click', function (e) {
      // closest child
      const btn = e.target.closest('.btn--bookmark');
      // guard clause
      if (!btn) return;
      handler();
    });
  }

  /**
   * Generate our recipe markup, this is the markup for the main recipe view that shows
   * Ingredients servings and all the general info about the recipe
   * @returns a markup string for placing into the html
   * @author ShAnder
   */
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
        <img src="${this._data.image}" alt=${
      this._data.title
    } class="recipe__img" />
        <h1 class="recipe__title">
            <span>${this._data.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href=${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href=${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings - 1
                }">
                    <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings + 1
                }">
                    <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                </button>
            </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
            <button class="btn--round btn--bookmark">
                <svg class="">
                    <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${this._data.ingredients
                  .map(this._generateMarkupIngredient)
                  .join('')}
            </ul>
        </div>

        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${
                  this._data.publisher
                }</span>. Please check out
                directions at their website.
            </p>
            <a
                class="btn--small recipe__btn"
                href=${this._data.sourceUrl}
                target="_blank"
            >
                <span>Directions</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </a>
        </div>

`;
  }

  /**
   * Small markup method to correctly parse ingredient amounts, as decimals can get really
   * long if we update the servings too many times, compresses it into a neat fraction for ui exp
   * @param {data item} ing
   * @returns markup string for adding into html
   * @author ShAnder
   */
  _generateMarkupIngredient(ing) {
    return `                
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ing.quantity ? new Fraction(ing.quantity).toString() : ''
            }</div>
            <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
            </div>
        </li>`;
  }
}

// export one instance of RecipeView for application use
export default new RecipeView();
