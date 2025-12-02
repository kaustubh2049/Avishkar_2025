import { Stack } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
import { router } from "expo-router";

export default function FarmerLayout() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== "farmer")) {
      router.replace("/select-user-type");
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return null; // Or a loading screen
  }

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Farmer Dashboard",
        }}
      />
    </Stack>
  );
}
