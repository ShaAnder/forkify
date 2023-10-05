// ---- IMPORTS ---- //

// for async
import { async } from 'regenerator-runtime';

//config
import { TIMEOUT_SEC } from '../config';

//helpers
import { timeout } from './timeout';

// Universal AJAX json function, will either POST or GET data depending on what's provided argument wise
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

    return data;

    // catch errors
  } catch (err) {
    throw err;
  }
};
