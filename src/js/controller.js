'use strict';

// ---- IMPORTS ---- //

// polyfilling everything
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// model
import * as model from './model.js';

// views
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// config
import { RECIPE_WINDOW, MODAL_CLOSE_SEC } from './config.js';

// ---- MAIN CODE ---- //

/**
 * Async (promise) control function, responsible for calling methods and views
 * to render the show the recipe on the page
 * @returns nothing / cancels function if no id
 * @author ShAnder
 */
const controlRecipes = async function () {
  // error handling
  try {
    // get our id, by sliccing the hash
    const id = window.location.hash.slice(1);
    // guard clause
    if (!id) return;
    // call the spinner for loading, and user exp
    recipeView.renderSpinner(RECIPE_WINDOW);
    // UPDATE results view (designed to update only what's new instead of rerendering everything)
    resultsView.update(model.getSearchResultsPage());
    // get our recipe by loading it with the id argument
    await model.loadRecipe(id);
    // Render recipe by passing in the state
    recipeView.render(model.state.recipe);
    // Update bookmarks by passing ins tate
    bookmarksView.update(model.state.bookmarks);
    // catch err
  } catch (err) {
    // render our error here
    recipeView.renderError();
    console.error(err);
  }
};

//---------------------------------------------------------------//

/**
 * Async (promise) control function, responsible for controlling the search results
 * and rendering them to the search bar
 * @returns nothing / cancels function if no id
 * @author ShAnder
 */
const controlSearchResults = async function () {
  try {
    //render our spinner
    resultsView.renderSpinner();
    // Get our query by calling the get query function from the searchView class
    const query = searchView.getQuery();
    // if no query guard
    if (!query) return;
    // no result to return so we immediately chain instead of store
    await model.loadSearchResults(query);
    // Render results from render function, a lot of hoops to go through so here's a quick tldr:
    // here -> getSearchResultsPage -> resultsView.render (inherited method) -> _data ->
    // _generateMarkupPreview -> _generateMarkup -> back here -> called in init
    resultsView.render(model.getSearchResultsPage(1));
    // render page buttons based on the state
    paginationView.render(model.state.search);
  } catch (err) {}
};

//---------------------------------------------------------------//

/**
 * Function responsible for controlling page scrolling, takes the dataset from paginationView
 * and passes it into getSearchResultsPage then resultsView.render which returns the state
 * @param {dataset} goToPage dataset for updating page number
 * @returns nothing
 * @author ShAnder
 */
const paginationController = function (goToPage) {
  // pass the dataset in
  resultsView.render(model.getSearchResultsPage(goToPage));
  // And render the NEW buttons
  paginationView.render(model.state.search);
};

//---------------------------------------------------------------//

/**
 * Function responsible for controlling the servings buttons and updating
 * the recipe view with the new ingredient amounts
 * @param {dataset} newServings html dataset, we need this to calc serving amounts in updateServings
 * @returns nothing
 * @author ShAnder
 */
const servingsController = function (newServings) {
  // pass new servings into the update servings func -> updatses the state
  model.updateServings(newServings);
  // pass state into recipeView update -> changes ONLY different items instead of
  // rerendering entire recipe, saves on load times and looks neater
  recipeView.update(model.state.recipe);
};

//---------------------------------------------------------------//

/**
 * Function responsible for controlling the bookmark add functionality.
 * allows us to add recipes to the bookmarks
 * @returns nothing
 * @author ShAnder
 */
const controlAddBookmark = function () {
  // Control when bookmarks get added, if added delete
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update the recipe view
  recipeView.update(model.state.recipe);
  // Render our bookmarks
  bookmarksView.render(model.state.bookmarks);
};

//---------------------------------------------------------------//

/**
 * Function resposible for rendering the bookmarks from the state
 * @returns nothing
 * @author ShAnder
 */
const controlBookmarks = function () {
  // render the bookmarks from the state to the html
  bookmarksView.render(model.state.bookmarks);
};

//---------------------------------------------------------------//

/**
 * Function resposible for adding recipes to our "account" (local storage + apikey)
 * @param {object} newRecipe object containing all the details of our new recipe
 * @returns nothing
 * @author ShAnder
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // add spinner
    addRecipeView.renderSpinner();
    // upload recipe
    await model.uploadRecipe(newRecipe);
    // render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    // update / render the bookmarks again to show new recipe added
    bookmarksView.render(model.state.bookmarks);
    // Use history api to add the id of the recipe to url
    window.history.pushState(null, '', `#{model.state.recipe.id}`);
  } catch {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

//---------------------------------------------------------------//

/**
 * Init Function, responsible for calling all our handlers (sub-pub)
 * @returns nothing
 * @author ShAnder
 */
const init = function () {
  // Render bookmarks
  bookmarksView.addHandlerRender(controlBookmarks);
  // Recipe subscriber
  recipeView.addHandlerRender(controlRecipes);
  // Serving button Subscriber
  recipeView.addHandlerUpdateServings(servingsController);
  // Bookmarks Subscriber
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // Search Results Subscriber
  searchView.addHandlerSearch(controlSearchResults);
  // Pagination Subscriber
  paginationView.addHandlerClick(paginationController);
  // Add Recipe Subscriber
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
