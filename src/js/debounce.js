// generic debounce from https://gist.github.com/peduarte/7ee475dd0fae1940f857582ecbb9dc5f
export default function debounce(func, wait = 100) {
  let timeout;
  // eslint-disable-next-line func-names
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
