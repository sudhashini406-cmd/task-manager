import { Store } from "@tanstack/store";
import { AuthUser } from "../../lib/interface/Types";

export type AuthState = {
  user: AuthUser | null;
};

const loadAuthState = (): AuthState => {
  try {
    const savedState = localStorage.getItem("authState");
    return savedState ? JSON.parse(savedState) : { user: null };
  } catch (error) {
    return { user: null };
  }
};

const initialState: AuthState = loadAuthState();
export const authStore = new Store<AuthState>(initialState);

// Function to update auth state
export const updateAuthStore = (updates: Partial<AuthState>) => {
  authStore.setState((state) => ({ ...state, ...updates }));
  if (typeof window !== "undefined") {
    localStorage.setItem("authState", JSON.stringify(authStore.state));
  }
};
