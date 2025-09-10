// CustomMessaging.tsx
import { View, useTheme } from "@aws-amplify/ui-react";
import AuthWithoutDua from "./AuthWithoutDua";

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
      <AuthWithoutDua onAgreed={onDuaAgreed} />
      <h4>Access to the complete dataset requires a data use agreement.</h4>
    </View>
  );
}
