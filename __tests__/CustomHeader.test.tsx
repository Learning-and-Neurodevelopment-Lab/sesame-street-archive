import React from 'react';
import { render } from '@testing-library/react';
import CustomHeader from '@/components/CustomHeader';

describe('CustomHeader', () => {
  it('renders without crashing', () => {
    render(<CustomHeader />);
  });
});
