"use client";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoogleSignIn, useLogin } from "@/hooks/useAuth";
import { QuickFormLogo } from "@/components/icons/QuickFormLogo";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

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

  const getErrorMessage = () => {
    if (loginMutation.error) {
      return loginMutation.error.message;
    }
    if (googleSignInMutation.error) {
      return googleSignInMutation.error.message;
    }
    return null;
  };
  const errorMessage = getErrorMessage();
  const isLoading = loginMutation.isPending || googleSignInMutation.isPending;

  const isAuthError = errorMessage && (
      errorMessage.toLowerCase().includes('incorrect') ||
      errorMessage.toLowerCase().includes('password') ||
      errorMessage.toLowerCase().includes('email')
  );
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
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Ready to continue your professional journey
                  </p>
                </div>

                {errorMessage && (
                    <div className={`
                  flex items-start gap-3 px-4 py-3 rounded-lg mb-6 border
                  ${isAuthError
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-orange-50 border-orange-200 text-orange-700'
                    }
                `}>
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm mt-1">{errorMessage}</p>
                      </div>
                    </div>
                )}
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
                          className={`
                        mt-1 block w-full rounded-lg bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500
                        ${isAuthError ? 'border-red-300' : 'border-gray-300'}
                      `}
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
                            className={`
                          block w-full rounded-lg bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 pr-10
                          ${isAuthError ? 'border-red-300' : 'border-gray-300'}
                        `}
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                    ) : (
                        "Sign in"
                    )}
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
                        className="group relative bg-white/80 hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 text-gray-700 shadow-sm hover:shadow hover:scale-102 transition-all duration-200 flex items-center justify-center py-6"
                    >
                    <span className="absolute left-6">
                      <GoogleIcon className="h-4 w-4 opacity-100 group-hover:opacity-100" />
                    </span>
                      <span className="px-6 font-medium">
                      {isLoading ? (
                          <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Signing in...
                        </span>
                      ) : (
                          "Continue with Google"
                      )}
                    </span>
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
