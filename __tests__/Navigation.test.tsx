import React from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Navigation from '@/components/Navigation';

describe('Navigation', () => {
  it('renders without crashing', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Navigation session={null} />
      </NextIntlClientProvider>
    );
  });
});
