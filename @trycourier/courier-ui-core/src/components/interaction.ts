export const interactiveStyles = `
  .interactive {
    display: inline-block;
    transition: all 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .interactive:hover {
    filter: brightness(0.95);
  }

  .interactive:active {
    filter: brightness(0.8);
  }

  .interactive.disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.6;
  }
`;

// Example usage in another component:
// 1. Import the styles
// 2. Add to your component's style element
// 3. Add 'interactive' class to your element
// 4. Add 'disabled' class when needed