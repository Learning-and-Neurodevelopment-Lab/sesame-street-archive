// __tests__/Navigation.test.tsx
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Navigation from "../components/Navigation";

jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

jest.mock("aws-amplify/auth", () => ({
  Auth: {
    signIn: jest.fn().mockResolvedValue({ username: "testUser" }),
  },
}));

const messages = {
  Navigation: {
    Home: "Home",
    Browse: "Browse",
  },
};

test("renders Navigation", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Navigation />
    </NextIntlClientProvider>
  );
});
