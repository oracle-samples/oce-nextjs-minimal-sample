/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import PropTypes from 'prop-types';

import filterXSS from 'xss';

/**
 * Section component.
 *
 * @param section the section to be displayed
 */
function Section({ section }) {
  const { renditionURLs } = section;
  const options = {
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
    // to filter out its content
  };

  const { fields } = section;
  const {
    heading,
    type,
    body,
    actions,
  } = fields;
  const cleantext = filterXSS(body, options);

  return (
    <section className={`content ${type}`} key={section.id}>
      <div>
        {renditionURLs && (
          <picture>
            <source type="image/webp" srcSet={renditionURLs.srcset} />
            <source srcSet={renditionURLs.jpgSrcset} />
            <img
              id="header-image"
              src={renditionURLs.large}
              alt="Company Logo"
              width={renditionURLs.width}
              height={renditionURLs.height}
            />
          </picture>
        )}
        <div>
          <h1>{heading}</h1>
          <div className="text">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: cleantext }} />
          </div>
          {actions && (
            <div>
              {actions.map((action) => (
                <a className="button" href={action.link}>
                  {action.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Section.propTypes = {
  section: PropTypes.shape().isRequired,
};

export default Section;
