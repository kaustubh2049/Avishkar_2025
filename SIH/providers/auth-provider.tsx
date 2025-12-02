import { supabase } from "@/lib/supabase";
import createContextHook from "@nkzw/create-context-hook";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UserType = "farmer" | "analyst";

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  userType: UserType;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          name: meta.name || "",
          email: session.user.email || "",
          organization: meta.organization || "",
          userType: meta.user_type || "analyst",
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to get session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          setUser({
            id: session.user.id,
            name: meta.name || "",
            email: session.user.email || "",
            organization: meta.organization || "",
            userType: meta.user_type || "analyst",
          });
        } else {
          setUser(null);
        }
      }
    );
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("No user found");
    }

    const authedUser = user;
    const isConfirmed =
      (authedUser as any).email_confirmed_at ||
      (authedUser as any).confirmed_at;
    if (!isConfirmed) {
      throw new Error("Email not confirmed. Please verify your email.");
    }

    const meta = authedUser.user_metadata || {};
    setUser({
      id: authedUser.id,
      name: meta.name || "",
      email: authedUser.email || "",
      organization: meta.organization || "",
      userType: meta.user_type || "analyst",
    });
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      organization: string,
      userType: UserType
    ) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            organization,
            user_type: userType, // Store user type in auth metadata
          },
          emailRedirectTo: Linking.createURL("/auth/callback"),
        },
      });

      if (error) throw error;

      // If email confirmation is enabled, there will be no confirmed session
      const authedUser = data.user;
      const hasSession = !!data.session;
      const isConfirmed =
        (authedUser as any)?.email_confirmed_at ||
        (authedUser as any)?.confirmed_at;
      if (hasSession && isConfirmed && authedUser) {
        const meta = authedUser.user_metadata || {};
        setUser({
          id: authedUser.id,
          name: meta.name || name,
          email: authedUser.email || email,
          organization: meta.organization || organization,
          userType: meta.user_type || userType,
        });
        return { needsVerification: false } as const;
      }
      return { needsVerification: true } as const;
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const getUserType = (user: any): UserType => {
    return user?.user_metadata?.user_type || "analyst"; // Default to analyst if not set
  };

  return useMemo(
    () => ({
      user,
      isLoading,
      signup: async (
        email: string,
        password: string,
        name: string,
        organization: string,
        userType: UserType
      ) => {
        return signup(email, password, name, organization, userType);
      },
      login,
      logout,
      getUserType,
    }),
    [user, isLoading, login, signup, logout]
  );
});
