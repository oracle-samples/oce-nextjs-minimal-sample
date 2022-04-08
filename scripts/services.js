/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable no-param-reassign */

/**
 * This file contains a number of utility methods used to obtain data
 * from the server using the Oracle Content SDK JavaScript Library.
 */

import getClient from './server-config-utils';

/**
* Utility method to log an error.
*/
function logError(message, error) {
  if (error && error.statusMessage) {
    console.log(`${message} : `, error.statusMessage);
  } else if (error.error && error.error.code && error.error.code === 'ETIMEDOUT') {
    console.log(`${message} : `, error);
  } else if (error.error && error.error.code) {
    console.log(`${message} : `, error.error.code);
  } else if (error) {
    console.error(message, error);
  }
  return {
    hasError: true,
    statusCode: error.statusCode,
    statusMessage: error.statusMessage,
    errno: error.errno,
    code: error.code,
  };
}

/**
* Private method for adding the specified format rendition to the rendition string
*
* @param {Object} url - the url which contains the rendition strings
* @param {Object} rendition - the rendition field of the content sdk json object
* @param {String} formatstr - the format string type - either webp or jpg
*/
function addRendition(urls, rendition, formatstr) {
  // Get the webp format field
  const format = rendition.formats.filter((item) => item.format === `${formatstr}`)[0];
  const self = format.links.filter((item) => item.rel === 'self')[0];
  const url = self.href;
  const { width } = format.metadata;

  // Also save the jpg format so that it can be used as a default value for images
  if (formatstr === 'jpg') {
    urls[rendition.name.toLowerCase()] = url;
    urls.jpgSrcset += `${url} ${width}w,`;
  } else {
    urls.srcset += `${url} ${width}w,`;
  }
}

/**
* Retrieve the sourceset for an asset that is constructed from the rendition
*
* @param {asset} client - the asset whose fields contain the various renditions
* @returns {Object} - An Object containing the the sourceset as well as individual rendition
* url that can be used as default src
*/
function getSourceSet(asset) {
  const urls = {};
  urls.srcset = '';
  urls.jpgSrcset = '';
  if (asset.fields && asset.fields.renditions) {
    asset.fields.renditions.forEach((rendition) => {
      addRendition(urls, rendition, 'jpg');
      addRendition(urls, rendition, 'webp');
    });
  }
  // add the native rendition to the srcset as well
  urls.srcset += `${asset.fields.native.links[0].href} ${asset.fields.metadata.width}w`;
  urls.native = asset.fields.native.links[0].href;
  urls.width = asset.fields.metadata.width;
  urls.height = asset.fields.metadata.height;
  return urls;
}

/**
* Fetch the specified item given its slug
*
* @param {string} slug - the item slug whose details are to be obtained
* @param {string} expand - the fields that need to be expanded
* @returns {Promise({Object})} - A Promise containing the data
*/
async function getItem(slug, expand) {
  const client = getClient();
  return client.getItem({
    slug,
    expand,
    language: 'en',
  }).then((asset) => asset)
    .catch((error) => logError('Fetching Item failed', error));
}

/**
* Fetch the item with the slug of minimalmain
*
* @returns {Promise({Object})} - A Promise containing the data
*/
export async function fetchOceMinimalMain() {
  const data = await getItem('minimalmain', 'fields.headerlogo,fields.footerlogo,fields.pages');
  if (!data.hasError) {
    const { fields } = data;
    const { headerlogo, footerlogo } = fields;
    // Extract the sourceset for the headerImage and footerImage and put it back in the data
    data.headerRenditionURLs = getSourceSet(headerlogo);
    data.footerRenditionURLs = getSourceSet(footerlogo);
  }
  return data;
}

/**
* Fetch the specified page content type given its slug
*
* @param {string} slug - the page slug whose details are to be obtained
* @returns {Promise({Object})} - A Promise containing the data
*/
export async function fetchPage(pageslug) {
  // Get the page details
  const page = await getItem(pageslug, 'fields.sections');
  return page;
}

/**
* Return the rendition URLs for the specified item.
*
* @param {string} identifier - the item id whose rendition URLs are to be obtained
* @returns {Promise({Object})} - A Promise containing the data
*/
export function getRenditionURLs(identifier) {
  const client = getClient();
  return client.getItem({
    id: identifier,
    expand: 'fields.renditions',
  }).then((asset) => getSourceSet(asset))
    .catch((error) => logError('Fetching Rendition URLs failed', error));
}
