import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService, type User } from "../shared/api/services/authService";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserStr = localStorage.getItem("spotplay_user");
        if (storedUserStr) {
          const parsed = JSON.parse(storedUserStr);
          // ВИПРАВЛЕНО: Перевіряємо, чи є вкладений ключ "user".
          // Якщо так, беремо його, якщо ні - беремо весь об'єкт.
          const actualUser = parsed.user ? parsed.user : parsed;
          setUser(actualUser);
        }

        if (localStorage.getItem("accessToken")) {
          const userData = await authService.getMe();
          setUser(userData);
          // Зберігаємо вже чистий об'єкт
          localStorage.setItem("spotplay_user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        setUser(null);
        localStorage.removeItem("spotplay_user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
