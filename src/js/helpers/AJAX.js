// ---- IMPORTS ---- //

//config
import { TIMEOUT_SEC } from '../config';

//helpers
import { timeout } from './timeout';

//---------------------------------------------------------------//

/**
 * Async export AJAX helper function for both get and post requests,
 * if no upload data will just get info if upload data will post
 * @param {string | object} data, url and upload data for get / post requests
 * @returns {json data} our response
 * @author ShAnder
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // if upload data post
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : // if no upload data get
        fetch(url);
    // resolve the request (race to get either the request or timeout for slow browsers)
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // error handling
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // response data
    return data;
    // catch errors
  } catch (err) {
    // propogate error
    throw err;
  }
};
