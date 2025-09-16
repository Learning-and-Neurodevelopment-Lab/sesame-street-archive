import { View, useTheme } from "@aws-amplify/ui-react";
import AuthNoDua from "../app/(main)/auth/signin/authNoDua"
import { profile } from "console";


export default function CustomHeader({
  onProfileCreated,
  profileCreated
}: {
  onProfileCreated: () => void;
  profileCreated: boolean;
}) {
  const { tokens } = useTheme();

  // Hide the header completely after agreement
  if (profileCreated) return null;

  return (
    <View textAlign="center" padding={tokens.space.large}>
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>

      <AuthNoDua onProfileCreated={onProfileCreated} />
      <h4>Access to the complete dataset requires a data use agreement.</h4>
    </View>
  );
}
