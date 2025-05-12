export const scrollMethod = (ev, element) => {
  const heightOfElement = element.offsetTop;
  window.scrollTo({
    top: heightOfElement,
    behavior: 'smooth'
  });
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
