
// __tests__/Navigation.test.tsx
import {render, screen} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import Navigation from '../components/Navigation';

const messages = {
  Navigation: {
    Home: 'Home',
    Browse: 'Browse',
  }
};

test('renders Navigation', () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Navigation />
    </NextIntlClientProvider>
  );
  // assertions...
});
