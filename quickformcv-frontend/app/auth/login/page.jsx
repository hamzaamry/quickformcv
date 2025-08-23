"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoogleSignIn, useLogin } from "@/hooks/useAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();
  const googleSignInMutation = useGoogleSignIn();

  const handleGoogleSignin = () => {
    googleSignInMutation.mutate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password, rememberMe });
  };

  const error =
    loginMutation.error?.message || googleSignInMutation.error?.message;
  const isLoading = loginMutation.isPending || googleSignInMutation.isPending;

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl"></div>
        <div className="w-full max-w-md space-y-8">
          <div className="relative">
            <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Welcome back to{" "}
                  <span className="relative whitespace-nowrap text-blue-600">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 281 40"
                      className="absolute left-0 top-1/2 h-[0.58em] w-full fill-blue-300/70"
                      preserveAspectRatio="none"
                    >
                      <path d="m114.75.916c-17.336-1.385-51.124 1.309-83.153 6.63L20.366 8.51C11.82 10.374 6.072 11.832 2.015 13.451.828 13.933.552 14.048.584 14.57c.047.809.552.747 6.396-.784 6.048-1.585 11.433-2.613 26.164-4.997C82.26 5.33 105.246 2.995 133.294 3.37c4.973.073 12.833.898 12.789 1.721-.059.79-5.249 2.873-17.167 6.911-14.659 4.969-23.62 8.356-24.467 9.256-1.449 1.539-.135 2.938 2.963 3.156 1.771.125 2.175.105 10.395-.52 23.602-1.79 38.63-2.326 58.910-2.094 30.884.354 50.481 1.487 87.192 5.056 13.191.928 13.876.976 16.371.888l.044-.007c.801-.135 1.02-1.217.266-1.557-1.94-.874-3.262-1.069-14.699-2.174-38.339-3.707-58.581-4.907-88.039-5.228-15.493-.169-22.411-.077-33.751.45-7.752.36-28.247 1.662-31.131 1.978-1.573.172 5.422-2.417 17.669-6.54 15.493-5.217 18.623-6.766 18.869-9.337.278-2.897-2.353-4-11.252-4.71Z" />
                    </svg>
                    <span className="relative">QuickForm CV</span>
                  </span>
                </h2>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <p className="mt-4 text-gray-600">
                  Ready to continue your professional journey
                </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Remember me
                    </Label>
                  </div>
                  {/*<Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>*/}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid">
                  <Button
                    type="button"
                    onClick={handleGoogleSignin}
                    disabled={isLoading}
                    variant="outline"
                    className="bg-white/50 backdrop-blur-sm border-gray-300 hover:bg-white/80"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isLoading ? "Signing in..." : "Google"}
                  </Button>
                </div>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
