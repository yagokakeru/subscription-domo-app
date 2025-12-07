"use client";

import { Provider, createStore } from "jotai";
import { userProfileAtom } from "@/lib/atoms/authUser";
import { userProfile } from "@/types/userProfile";

export function AuthProvider({
  children,
  userProfile,
}: {
  children: React.ReactNode;
  userProfile: userProfile | null;
}) {
  const store = createStore();
  store.set(userProfileAtom, userProfile ?? null);

  return <Provider store={store}>{children}</Provider>;
}
