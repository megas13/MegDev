"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin-session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setIsAuthenticated(data.authenticated === true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false))
  }, [])

  const signIn = async (password: string) => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) return "Hatalı şifre!"
    localStorage.setItem("admin_token", "authenticated")
    setIsAuthenticated(true)
    return null
  }

  const signOut = async () => {
    await fetch("/api/admin-logout", { method: "POST" }).catch(() => null)
    localStorage.removeItem("admin_token")
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
