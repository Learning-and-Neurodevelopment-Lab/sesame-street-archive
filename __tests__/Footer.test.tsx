import React from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/en.json';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>
    );
  });
});
