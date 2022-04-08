/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Page from '../../components/Page';

import { fetchOceMinimalMain, fetchPage, getRenditionURLs } from '../../scripts/services';

/**
* Main component that renders the header, page and footer. The Page loaded corresponds to the
* page slug passed in.
*/
function Main(props) {
  const {
    headerRenditionURLs, footerRenditionURLs, pages, pageData,
  } = props;

  return (
    <>
      <Head>
        <title>{pageData.name}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content="Sample Minimal app created in NextJs that utilizes the content sdk library" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Header pages={pages} headerRenditionURLs={headerRenditionURLs} />
      <Page pageData={pageData} />
      <Footer footerRenditionURLs={footerRenditionURLs} />
    </>
  );
}

/**
* Called during build to generate this page.
*
* This is never called when the application is running,
* i.e. its not called on the server when a request comes in or on the client side.
*/
export async function getStaticProps(context) {
  // fetch the minimal main data
  const appData = await fetchOceMinimalMain();
  // find the slug param from the context. If its null, default to the first page slug
  const { params } = context;
  let { slug } = params;
  if (slug == null) {
    slug = appData.fields.pages[0].slug;
  }
  // fetch the page corresponding to the slug
  const pageData = await fetchPage(slug);
  const { headerRenditionURLs, footerRenditionURLs, fields } = appData;
  const { sections } = pageData.fields;

  // for each section in the page, if a image is present, get the corresponding rendition urls
  // and insert it back into the section
  const promises = [];
  sections.forEach((section) => {
    // add a promise to the total list of promises to get any section rendition urls
    if (section.fields.image) {
      promises.push(
        getRenditionURLs(section.fields.image.id)
          .then((renditionURLs) => {
            // eslint-disable-next-line no-param-reassign
            section.renditionURLs = renditionURLs;
          }),
      );
    }
  });

  // execute all the promises and return all the data
  await Promise.all(promises);
  return {
    props: {
      headerRenditionURLs,
      footerRenditionURLs,
      pages: fields.pages,
      pageData,
    },
  };
}

/**
 * Called during build to generate all paths to this .
 * This is never called when the application is running,
 */
export async function getStaticPaths() {
  const appData = await fetchOceMinimalMain();
  const { fields } = appData;

  // Generate the paths we want to pre-render based on posts
  const paths = fields.pages.map((page) => ({
    params: { slug: [page.slug] },
  }));
  // Also add the path for the root /
  paths.push({
    params: { slug: [] },
  });
  return {
    paths,
    fallback: false,
  };
}

export default Main;

Main.propTypes = {
  headerRenditionURLs: PropTypes.shape().isRequired,
  footerRenditionURLs: PropTypes.shape().isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pageData: PropTypes.shape().isRequired,
};
