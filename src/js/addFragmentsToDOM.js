export const appendFragmentsToParent = (fragmentParts, parentEl) => {
  const fragment = document.createDocumentFragment();
  fragmentParts.forEach(fragmentPart => fragment.appendChild(fragmentPart));
  parentEl.appendChild(fragment);
};

export const prependFragmentsToParent = (fragmentParts, parentEl) => {
  const fragment = document.createDocumentFragment();
  fragmentParts.forEach(fragmentPart => fragment.appendChild(fragmentPart));
  parentEl.prepend(fragment);
};
