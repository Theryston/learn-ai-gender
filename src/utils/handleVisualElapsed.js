module.exports = async function handleVisualElapsed(endTime, startTime) {
  const timeElapsed = new Date(endTime - startTime);
  const hours = timeElapsed.getUTCHours();
  const minutes = timeElapsed.getUTCMinutes();
  const seconds = timeElapsed.getUTCSeconds();
  const milliseconds = timeElapsed.getUTCMilliseconds();

  const visualElapsed = `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
  return visualElapsed;
};
