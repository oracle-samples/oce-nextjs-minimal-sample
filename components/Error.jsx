/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error component.
 *
 * @param errorObj the error object to be displayed
 */
function Error({ errorObj }) {
  if (!errorObj.hasError) return null;
  const { statusCode } = errorObj;
  return (
    <div className="error">
      <h1>Error !</h1>
      {
        statusCode === 404
          ? <p>Sorry, the item you are requesting has not been found.</p>
          : <p>{JSON.stringify(errorObj)}</p>
      }
    </div>
  );
}

Error.propTypes = {
  errorObj: PropTypes.shape().isRequired,
};

export default Error;
