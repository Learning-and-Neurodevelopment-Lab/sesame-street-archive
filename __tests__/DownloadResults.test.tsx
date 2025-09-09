import React from 'react';
import { render } from '@testing-library/react';
import DownloadResults from '@/components/DownloadResults';

describe('DownloadResults', () => {
  it('renders without crashing', () => {
    render(<DownloadResults annotations={[]} />);
  });
});
