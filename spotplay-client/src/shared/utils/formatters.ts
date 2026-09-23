export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSecondsToHM = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return {
    h: hours.toString(),
    m: minutes.toString().padStart(2, "0"),
  };
};

export const parseTime = (timeStr: string) => {
  const hMatch = timeStr.match(/(\d+)h/);
  const mMatch = timeStr.match(/(\d+)m/);

  return {
    h: hMatch ? hMatch[1] : "0",
    m: mMatch ? mMatch[1] : "0",
  };
};
