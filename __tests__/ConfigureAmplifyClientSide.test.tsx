import React from 'react';
import { render } from '@testing-library/react';
import ConfigureAmplifyClientSide from '@/components/ConfigureAmplifyClientSide';

describe('ConfigureAmplifyClientSide', () => {
  it('renders without crashing', () => {
    render(<ConfigureAmplifyClientSide />);
  });
});
