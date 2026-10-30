import { render } from '@testing-library/react';

import BrandName from '../src/components/BrandName';

describe('BrandName', () => {
  it('spells the brand as three words', () => {
    const { container } = render(<BrandName />);
    expect(container.textContent).toBe('ZICK ONE ZERO');
  });

  it('marks only ONE for accent styling', () => {
    const { container } = render(<BrandName />);
    const highlighted = container.querySelectorAll('.brand-one');
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toHaveTextContent('ONE');
  });
});
