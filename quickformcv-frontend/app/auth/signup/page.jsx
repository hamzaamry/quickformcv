"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useGoogleSignIn, useSignup } from "@/hooks/useAuth"
import { QuickFormLogo } from "@/components/icons/QuickFormLogo"
import { GoogleIcon } from "@/components/icons/GoogleIcon"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const signupMutation = useSignup()
  const googleSignInMutation = useGoogleSignIn()

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleGoogleSignup = () => {
    googleSignInMutation.mutate()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signupMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    })
  }

  const error = signupMutation.error?.message || googleSignInMutation.error?.message
  const isLoading = signupMutation.isPending || googleSignInMutation.isPending

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl"></div>
        <div className="w-full max-w-md space-y-8">
          <div className="relative">
            <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                  <QuickFormLogo className="h-10 w-auto" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create your account</h2>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mt-4">
                    {error}
                  </div>
                )}
                <p className="mt-2 text-gray-600">Start building your professional resume for free</p>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-gray-300 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? "Creating account..." : "Create your free account"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                  </div>
                </div>
                <div className="grid">
                  <Button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    variant="outline"
                    className="group relative bg-white/80 hover:bg-white/95 border border-gray-300 text-gray-700 shadow-sm hover:shadow hover:scale-102 transition-all duration-200 flex items-center justify-center py-6"
                  >
                    <span className="absolute left-6">
                      <GoogleIcon className="h-4 w-4 opacity-100 group-hover:opacity-100" />
                    </span>
                    <span className="px-6 font-medium">{isLoading ? "Signing up..." : "Continue with Google"}</span>
                  </Button>
                </div>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
