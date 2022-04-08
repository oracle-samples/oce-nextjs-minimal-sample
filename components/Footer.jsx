/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import PropTypes from 'prop-types';

import facebookImage from '../public/facebook.png';
import linkedinImage from '../public/linkedin.png';
import twitterImage from '../public/twitter.png';
import youtubeImage from '../public/youtube.png';

/**
* Footer component.
*
* @param footerRenditionURLs the rendtion URLs for the image to be displayed in the footer
*/
function Footer({ footerRenditionURLs }) {
  return (
    <footer id="footer">
      {/* Logo */}
      {footerRenditionURLs
      && (
        <picture>
          <source type="image/webp" srcSet={footerRenditionURLs.srcset} sizes="300px" />
          <img
            id="footer-image"
            src={footerRenditionURLs.native}
            alt="Footer Logo"
            width={footerRenditionURLs.width}
            height={footerRenditionURLs.height}
          />
        </picture>
      )}
      {/* Social Media Icons */}
      {/* Note: the resolved img src will be the following
            publicPath + name_of_image_in_public_folder
        dev example, where publicPath is empty:
            src="14375eb7bad965f473afeb54c18b8ba4.png"
        prod example, if package.json has baseurl=/a/b
            src="/a/b/14375eb7bad965f473afeb54c18b8ba4.png"
        webpack.base.config.js ensures that, when set, publicPath has a trailing slash
    */}
      <div className="social-media-menu">
        <a href="https://www.facebook.com/Oracle/">
          <img src={facebookImage} alt="Facebook" />
        </a>
        <a href="https://www.linkedin.com/company/oracle/">
          <img src={linkedinImage} alt="Linked In" />
        </a>
        <a href="https://twitter.com/Oracle">
          <img src={twitterImage} alt="Twitter" />
        </a>
        <a href="https://www.youtube.com/oracle/">
          <img src={youtubeImage} alt="You Tube" />
        </a>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  footerRenditionURLs: PropTypes.shape().isRequired,
};

export default Footer;
