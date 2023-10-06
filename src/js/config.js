// Constants and resuables that are used throughout the file are stored here

// API URL

// api url for getting recipes
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes';

// api key
export const API_KEY = 'Place API Key Here';

// "MAGIC" NUMBERS

// page timeout
export const TIMEOUT_SEC = 10;
// results per page for recipes
export const RES_PER_PAGE = 13;
// modal window close timer
export const MODAL_CLOSE_SEC = 2.5;

// DOM CONTROLLERS

// recipe window
export const RECIPE_WINDOW = document.querySelector('.recipe');
// search button
export const SEARCH = document.querySelector('.search');
// search results
export const RESULTS = document.querySelector('.results');
// pages
export const PAGINATION = document.querySelector('.pagination');
// bookmarks
export const BOOKMARKS = document.querySelector('.bookmarks');
// add recipe
export const RECIPE_UPLOAD = document.querySelector('.upload');
export const ADD_RECIPE_WINDOW = document.querySelector('.add-recipe-window');
export const OVERLAY = document.querySelector('.overlay');
export const OPEN_MODAL = document.querySelector('.nav__btn--add-recipe');
export const CLOSE_MODAL = document.querySelector('.btn--close-modal');
