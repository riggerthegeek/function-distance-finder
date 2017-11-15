/**
 * handler
 */

/* Node modules */

/* Third-party modules */
const distance = require('google-distance');

/* Files */

const apiKey = process.env.API_KEY;

if (apiKey) {
  distance.apiKey = apiKey;
}

function getDistance (opts = {}, cb) {
  return new Promise((resolve, reject) => {
    distance.get(opts, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  }).then(({ distanceValue }) => cb(null, distanceValue))
    .catch(err => cb(err));
}

module.exports = (args = {}) => {
  console.log(args);
  const origin = args.start;
  const destination = args.dest;
  const isReturn = args.return || false;

  if (!origin) {
    return Promise.reject(new Error('DATA MISSING: start'));
  }
  if (!destination) {
    return Promise.reject(new Error('DATA MISSING: dest'));
  }

  const opts = {
    origin,
    destination,
    mode: args.mode,
    avoid: args.avoid,
  };

  const tasks = [
    getDistance(opts),
  ];

  if (isReturn) {
    /* Return journey - set dest to start and vice versa */
    const returnOpts = Object.assign({}, opts);
    returnOpts.destination = origin;
    returnOpts.origin = destination;

    tasks.push(getDistance(returnOpts));
  }

  return Promise.all(tasks)
    .then(([ outbound, inbound = 0]) => outbound + inbound);
};
