export const scrollMethod = (ev, element) => {
  const heightOfElement = element.offsetTop;
  window.scrollTo({
    top: heightOfElement,
    behavior: 'smooth'
  });
};
