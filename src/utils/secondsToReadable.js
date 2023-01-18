const secondsToReadable = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  // const hours = Math.floor(time / 3600);

  return `${minutes} min and ${seconds} seconds`;
};

export default secondsToReadable;
