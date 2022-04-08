/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import Error from './Error';

/**
* Component for Page.
*/
class Page extends React.Component {
  render() {
    const { pageData } = this.props;
    if (pageData.hasError) {
      return (
        <Error errorObj={pageData} />
      );
    }
    const { sections } = pageData.fields;

    return (
      <div key={pageData.id}>
        {sections && (
        <div id="sections">
          {sections.map(
            (section) => (
              <Section section={section} key={section.id} />
            ),
          )}
        </div>
        )}
      </div>
    );
  }
}

Page.propTypes = {
  pageData: PropTypes.shape().isRequired,
};

export default Page;
