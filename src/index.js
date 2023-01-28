import link from './link';
import { port } from './config';
import { Transform } from 'stream';

let tickCt = 0;

link(
  new Transform({
    transform(chunk, enc, cb) {
      tickCt += 1;
      console.log('PORT:', port, 'TICK:', tickCt);

      // The "setTimeout" if to prevent the "train" from travelling at maximal speed.
      // This is NOT to provide it with kinetic energy.
      // If you just replace this with "cb(null, chunk)" it will tick even faster.
      // So it is NOT this that causes the spin. On the contrary, this is a break.
      setTimeout(cb, 500, null, chunk);
    },
  })
);
