export const particleBgColors = () => {
  // for dark use atom one dark, for light use CLRS
  const background = (darkMode = false) => (darkMode ? '#1f1f1f' : '#f8f8f8');
  const particle = (darkMode = false) => (darkMode ? '#c678dd' : '#5C7C8A');
  const links = (darkMode = false) => (darkMode ? '#98c379' : '#E7B669');

  return {
    background,
    particle,
    links,
  };
};