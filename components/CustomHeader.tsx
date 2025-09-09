import { View, useTheme } from '@aws-amplify/ui-react';

const CustomHeader = () => {
  const { tokens } = useTheme();

  return (
    <View textAlign="center" padding={tokens.space.large}>
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <h2>Website in development. Account creation not permitted.</h2>
    </View>
  );
};

export default CustomHeader;