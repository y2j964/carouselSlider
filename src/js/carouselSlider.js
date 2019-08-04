import {
  appendFragmentsToParent,
  prependFragmentsToParent,
} from './addFragmentsToDOM';

export const slider = document.querySelector('.slider-wrapper');
const slides = Array.from(document.querySelectorAll('.slide'));

// slider starts at 100 to offset clones
const step = 100;
let sliderX = step;

let slidesPerPosition;
let slideWidth;
let remainderSlides;
let endPositionX;
const activeSlides = [];

const mediaBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const animateSliderPosition = () => {
  slider.style.transition = 'transform 400ms ease-in-out';
  slider.style.transform = `translateX(${-sliderX}%)`;
};

const jumpSliderPosition = () => {
  slider.style.transition = 'none';
  slider.style.transform = `translateX(${-sliderX}%)`;
};

// slide activation

const activateSlides = () => {
  for (let i = 0; i < slidesPerPosition; i += 1) {
    const slide = slides[sliderX / slideWidth - slidesPerPosition + i];
    slide.classList.add('slide--is-active');
    slide.setAttribute('aria-hidden', 'false');
    activeSlides.push(slide);
  }
};

const activateEndingPositionSlides = () => {
  for (let i = slides.length - slidesPerPosition; i < slides.length; i += 1) {
    const slide = slides[i];
    slide.classList.add('slide--is-active');
    slide.setAttribute('aria-hidden', 'false');
    activeSlides.push(slide);
  }
};

const deactivateSlides = () => {
  activeSlides.forEach(slide => {
    slide.classList.remove('slide--is-active');
    slide.setAttribute('aria-hidden', 'true');
  });
  // empty array
  activeSlides.splice(0);
};

// slide dupes

const removeOldSlideDupes = () => {
  const oldDupes = Array.from(document.querySelectorAll('.slide-dupe'));
  oldDupes.forEach(item => item.remove());
};

const cloneFirstPositionSlides = () => {
  const firstSlideDupes = [];
  for (let i = 0; i < slidesPerPosition; i += 1) {
    const slideDupe = slides[i].cloneNode(true);
    slideDupe.classList.add('slide-dupe');
    firstSlideDupes.push(slideDupe);
  }
  return firstSlideDupes;
};

const cloneLastPositionSlides = () => {
  const lastSlideDupes = [];
  for (let i = slides.length - slidesPerPosition; i < slides.length; i += 1) {
    const slideDupe = slides[i].cloneNode(true);
    slideDupe.classList.add('slide-dupe');
    lastSlideDupes.push(slideDupe);
  }
  return lastSlideDupes;
};

const addNewSlideDupes = () => {
  const firstRelevantSlideDupes = cloneFirstPositionSlides();
  const lastRelevantSlideDupes = cloneLastPositionSlides();
  appendFragmentsToParent(firstRelevantSlideDupes, slider);
  prependFragmentsToParent(lastRelevantSlideDupes, slider);
};

// slider config

const activateResizedSlides = activeSlide => {
  const activeIndex = slides.indexOf(activeSlide);
  // on resize, we want to maintain the left-most slide
  // if the left-most slide doesn't support a wider viewport (i.e. you end up wrapping
  // the ending and beginning slides), just use last position
  if (activeIndex > slides.length - slidesPerPosition) {
    activateEndingPositionSlides();
    sliderX = endPositionX;
    jumpSliderPosition();
  } else {
    for (let i = activeIndex; i < activeIndex + slidesPerPosition; i += 1) {
      const slide = slides[i];
      slide.classList.add('slide--is-active');
      slide.setAttribute('aria-hidden', 'false');
      activeSlides.push(slide);
    }
    sliderX = activeIndex * slideWidth + step;
    jumpSliderPosition();
  }
};

const initSlideData = slidesPerRow => {
  slidesPerPosition = slidesPerRow;
  remainderSlides = slides.length % slidesPerPosition;
  slideWidth = step / slidesPerPosition;
  endPositionX = slideWidth * slides.length;
};

const configureSlider = slidesPerRow => {
  const activeSlide = document.querySelector('.slide--is-active');
  deactivateSlides();
  removeOldSlideDupes();
  initSlideData(slidesPerRow);
  addNewSlideDupes();
  if (activeSlide) {
    activateResizedSlides(activeSlide);
  } else {
    activateSlides();
  }
};

export const vwCheck = () => {
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;
  switch (true) {
    case viewportWidth < mediaBreakpoints.sm && slidesPerPosition !== 1: {
      configureSlider(1);
      break;
    }
    case viewportWidth > mediaBreakpoints.sm &&
      viewportWidth < mediaBreakpoints.md &&
      slidesPerPosition !== 2: {
      configureSlider(2);
      break;
    }
    case viewportWidth > mediaBreakpoints.md &&
      viewportWidth < mediaBreakpoints.lg &&
      slidesPerPosition !== 3: {
      configureSlider(3);
      break;
    }
    case viewportWidth > mediaBreakpoints.lg &&
      viewportWidth < mediaBreakpoints.xl &&
      slidesPerPosition !== 4: {
      configureSlider(4);
      break;
    }
    case viewportWidth > mediaBreakpoints.xl && slidesPerPosition !== 5: {
      configureSlider(5);
      break;
    }
    default:
  }
};

// moving slider

export const moveSliderBackward = () => {
  // prevent the user from running slider off the tracks by clicking faster than the transitions
  if (sliderX < step) {
    return;
  }
  deactivateSlides();

  // if sliderX % 100 isn't equal to zero, there is a remainder,
  // indicating oddly displaced slides (remaining slides)
  if (sliderX % 100 !== 0 && sliderX < 200) {
    // put slider back on regular track at the first position;
    sliderX -= remainderSlides * slideWidth;
    sliderX = Math.floor(sliderX);
    activateSlides();
    animateSliderPosition();
  } else if (sliderX === step) {
    sliderX -= step;
    animateSliderPosition();
  } else {
    sliderX -= step;
    activateSlides();
    animateSliderPosition();
  }
};

export const moveSliderForward = () => {
  if (sliderX === endPositionX + step) {
    // prevents slider from sliding off tracks; endPositionX + step is the clones at the end
    return;
  }
  deactivateSlides();
  if (sliderX > endPositionX - step && sliderX < endPositionX) {
    // if there are displaced slides, do a partial position shift at the end
    sliderX = endPositionX;
    activateSlides();
    animateSliderPosition();
  } else if (sliderX === endPositionX) {
    sliderX += step;
    animateSliderPosition();
  } else {
    sliderX += step;
    activateSlides();
    animateSliderPosition();
  }
};

export const wrapAround = () => {
  if (sliderX === 0) {
    sliderX = endPositionX;
    activateSlides();
    jumpSliderPosition();
    return;
  }

  if (sliderX === endPositionX + step) {
    sliderX = step;
    activateSlides();
    jumpSliderPosition();
  }
};
