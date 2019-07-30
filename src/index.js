import debounce from './js/debounce';
import {
  slider,
  wrapAround,
  vwCheck,
  moveSliderBackward,
  moveSliderForward,
} from './js/carouselSlider';
import './styles/tailwind.src.css';

const arrowLeft = document.querySelector('#arrow-left');
const arrowRight = document.querySelector('#arrow-right');

arrowLeft.addEventListener('click', moveSliderBackward);
arrowRight.addEventListener('click', moveSliderForward);
slider.addEventListener('transitionend', wrapAround);
window.addEventListener('resize', debounce(vwCheck));
vwCheck();
