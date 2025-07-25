import { render } from '@testing-library/react';
import { CourierInbox } from '../../components/courier-inbox';

describe('CourierInbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render skeleton with default props when no props are provided', () => {
      const { container } = render(<CourierInbox />);

      // The component should render (check title and skeleton items)
      expect(container.querySelector('courier-inbox-header-title')?.textContent).toBe('Inbox');
      expect(container.querySelectorAll('.skeleton-item').length).toBeGreaterThan(0);
    });
  });
});
