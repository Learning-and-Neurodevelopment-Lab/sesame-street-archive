import React from 'react';
import { render } from '@testing-library/react';
import ConfigureAmplifyClientSide from '@/components/ConfigureAmplifyClientSide';

jest.mock('../amplify_outputs.json', () => ({}), { virtual: true })

describe('ConfigureAmplifyClientSide', () => {
  it('renders without crashing', () => {
    render(<ConfigureAmplifyClientSide />);
  });
});
