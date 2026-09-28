import { render } from '@testing-library/react';

import BrandName from '../src/components/BrandName';

describe('BrandName', () => {
  it('keeps the brand spelled as one word', () => {
    const { container } = render(<BrandName />);
    expect(container).toHaveTextContent(/^ZICKONEZERO$/);
  });

  it('marks ONE separately from the accent-colored ZICK and ZERO', () => {
    const { container } = render(<BrandName />);
    const highlighted = container.querySelectorAll('.brand-one');
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toHaveTextContent('ONE');
  });
});
