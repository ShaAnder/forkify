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

// We're creating a function to show the recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // guard clause
    if (!id) return;

    // we're calling spinner from the recipie view, and passing in the window dom element
    recipeView.renderSpinner(RECIPE_WINDOW);

    // now we return the results view to mark selected search result
    // we could use render but if we do that we will get the same flickering as before
    // because everything will be rerendered, that's why we created update in the first place
    resultsView.update(model.getSearchResultsPage());

    // load recipe from the model, with our id
    await model.loadRecipe(id);

    // render recipe using our render function from recipe view
    recipeView.render(model.state.recipe);
    // updating bookmarks
    bookmarksView.update(model.state.bookmarks);
    // catch err
  } catch (err) {
    // we use the render err here, propogated from other files by throwing err
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //render our spinner
    resultsView.renderSpinner();

    // we could just select the element here, but it's about the dom so in the views it goes
    const query = searchView.getQuery();

    if (!query) return;

    // not storing a result because nothing to return
    await model.loadSearchResults(query);

    // render our results by passing the search result back into the render
    // because this is now a parent child class (and for notes sake)
    // the movement of the variable goes from
    // here -> getSearchResultsPage -> resultsView.render (inherited method) -> _data ->
    // _generateMarkupPreview -> _generateMarkup -> back here -> called in init
    resultsView.render(model.getSearchResultsPage(1));

    // Render the initial page buttons we get from the search result
    // same as above -> sent to render -> data -> to generate markup ect
    paginationView.render(model.state.search);
  } catch (err) {}
};

// we have another controller here for the pagination
const paginationController = function (goToPage) {
  // Now er want to render NEW results (this works because render clears then overwrites the info)
  resultsView.render(model.getSearchResultsPage(goToPage));
  // And render the NEW buttons
  paginationView.render(model.state.search);
};

// we're going to build another controller to control servings, just a note while we call these
// controllers they really are just handlers, we're using mvc so we might as well just stick to
// naming convention

const servingsController = function (newServings) {
  // update the recipe servings in the model (in state)
  model.updateServings(newServings);
  // now we update the recipe - because we only want to update certain parts of the dom
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// BOOKMARK CONTROLLER
const controlAddBookmark = function () {
  // Control when bookmarks get added, if added delete
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update the recipe view
  recipeView.update(model.state.recipe);
  // Render our bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // add spinner for loading purposes
    addRecipeView.renderSpinner();

    // upload recipe
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // we need to update / render the bookmarks view with new recipe
    bookmarksView.render(model.state.bookmarks);

    // now we want to change the id in the url using the history api
    window.history.pushState(null, '', `#{model.state.recipe.id}`);
  } catch {
    console.error(err);
    addRecipeView.renderError(err);
  }
  // uploade new recipe data
};

// INIT SUB / PUB CONTROLLER FUNCTION
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
