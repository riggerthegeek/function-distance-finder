/**
 * index
 */

/* Node modules */

/* Third-party modules */
const getStdin = require('get-stdin');

/* Files */
const handler = require('./function/handler');

const isArray = a => (!!a) && (Array.isArray(a));

const isObject = a => (!!a) && a.constructor === Object;

getStdin()
  .then(input => {
    return handler(input)
      .then((result) => {
        if (isArray(result) || isObject(result)) {
          console.log(JSON.stringify(result));
          return;
        }

        process.stdout.write(result);
      })
      .catch(err => {
        process.stderr.write(err.stack);
      });
  })
  .catch(err => {
    /* STDIN error */
    console.error(err.stack);
  });
