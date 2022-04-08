/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
// When you wrap withRouter around a component it will give
// you read access to the router as a param
import Link from 'next/link';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
* Header component.
*
* @param headerRenditionURLs rendition urls for the header logo
* @param pages the pages data
* @param location the location object made available via withRouter
*/
class Header extends React.Component {
  /*
   * Show/hide the drop down menu in narrow screens when the
   * button is clicked and update the button styling.
   */
  static onDropDownMenuButtonClicked() {
    const dropDownMenu = document.getElementById('nav-menu-items');
    const menuButton = document.getElementById('nav-menu-button');

    if (dropDownMenu.className === '') {
      dropDownMenu.className = 'displayed';
      menuButton.className = 'active';
    } else {
      dropDownMenu.className = '';
      menuButton.className = '';
    }
  }

  /*
  * Render this component
  */
  render() {
    const { headerRenditionURLs, pages, router } = this.props;
    let pageslug = router.asPath.split('/').pop();
    if (!pageslug || pageslug === 'page') pageslug = pages[0].slug;
    const pageItems = pages.map((page) => (
      <li key={page.slug}>
        <Link
          id={page.slug}
          href={{
            pathname: `${publicRuntimeConfig.basePath || ''}/page/[page.slug]`,
          }}
          as={{
            pathname: `${publicRuntimeConfig.basePath || ''}/page/${page.slug}`,
          }}
        >
          <a
            className={page.slug === pageslug ? 'active' : ''}
            style={{ textDecoration: 'none' }}
          >
            {page.name}
          </a>
        </Link>
      </li>
    ));

    return (
      <header id="header">
        <Link
          href={{
            pathname: `${publicRuntimeConfig.basePath || ''}/`,
          }}
          as={{
            pathname: `${publicRuntimeConfig.basePath || ''}/`,
          }}
        >
          {/* Header Logo */}
          {headerRenditionURLs
            && (
              <picture>
                <source type="image/webp" srcSet={headerRenditionURLs.srcset} />
                <img
                  id="header-image"
                  src={headerRenditionURLs.native}
                  alt="Company Logo"
                  width={headerRenditionURLs.width}
                  height={headerRenditionURLs.height}
                />
              </picture>
            )}
        </Link>
        {/* Collapsed menu */}
        <nav>
          <button
            id="nav-menu-button"
            onClick={Header.onDropDownMenuButtonClicked}
            type="button"
          >
            ☰
          </button>

          <ul id="nav-menu-items">
            {pageItems}
          </ul>
        </nav>

      </header>
    );
  }
}

Header.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  headerRenditionURLs: PropTypes.shape().isRequired,
  router: PropTypes.shape().isRequired,
};

export default withRouter(Header);
