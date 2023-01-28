export const port = parseInt(process.argv[2].replace(/--port[= ]/, ''));

export const firstPort = Number(process.env.FIRST_PORT);

export const lastPort = Number(process.env.LAST_PORT);

export const nextPort = port === lastPort ? firstPort : port + 1;
