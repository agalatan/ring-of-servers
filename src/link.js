import { port, nextPort, lastPort } from './config';
import retry from 'async-retry';
import net from 'net';
import { pipeline } from 'stream/promises';

// 3000 => 3001 => 3002 => 3003 => 3004 => 3005 => 3006 => 3007 => 3008 => 3009 => 3010 => 3000

// For the one on your "left" you act as a Server (3001 is a Server for 3000)
const L = () =>
  new Promise((resolve) => {
    net.createServer(resolve).listen(port);
  });

// For the one on your "right" you act as a Client (3001 is a Client for 3002)
const R = () =>
  retry(
    () =>
      new Promise((resolve, reject) => {
        net
          .connect({ host: 'localhost', port: nextPort }, function () {
            // The last one (3010) drops a "particle" into the tunnel.
            // The "particle" is just the character '0'.
            if (port === lastPort) {
              this.write('0');
            }
            resolve(this);
          })
          .on('error', reject);
      }),
    { minTimeout: 2000 }
  );

export default async (trainStop) => {
  const [l, r] = await Promise.all([L(), R()]);
  await pipeline(l, trainStop, r);
};
