export const debug = (...args: unknown[]) => {
  if (process.env.DEBUG !== 'true') {
    return;
  }

  console.log(...args);
};
