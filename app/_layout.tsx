import { Stack } from "expo-router";
import React, { useState } from "react";
import "./global.css";

export default function RootLayout() {

  return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tab)" options={{ headerShown: false }} />
      </Stack>
  );
}
