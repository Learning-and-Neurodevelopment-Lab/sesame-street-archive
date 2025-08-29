// CustomMessaging.tsx
import { View, useTheme } from "@aws-amplify/ui-react";
import AuthWithDua from "./AuthWithDua";

export default function CustomHeader({
  onDuaAgreed,
  duaAccepted
}: {
  onDuaAgreed: () => void;
  duaAccepted: boolean;
}) {
  const { tokens } = useTheme();

  // Hide the header completely after agreement
  if (duaAccepted) return null;

  return (
    <View textAlign="center" padding={tokens.space.large}>
      <AuthWithDua onAgreed={onDuaAgreed} />
      <h2>Account creation requires a Data Use Agreement.</h2>
    </View>
  );
}
