import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schemas for form validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
  fullName: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, navigate] = useLocation();
  const { user, login, register, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form handling
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form handling
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  // Form submission handlers
  function onLoginSubmit(values: LoginFormValues) {
    login(values);
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    register(values);
  }

  return (
    <div className="flex min-h-screen w-full bg-black">
      {/* Login/Register Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold mb-2 text-center uppercase tracking-tighter">
            MMA<span className="text-primary">Predict</span>
          </h1>
          <p className="text-zinc-400 text-center mb-8 text-sm uppercase tracking-wide font-medium">Sign in to access exclusive features and predictions</p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-900 p-1 rounded-none">
              <TabsTrigger value="login" className="uppercase font-bold tracking-wide rounded-none">Login</TabsTrigger>
              <TabsTrigger value="register" className="uppercase font-bold tracking-wide rounded-none">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card className="border-none bg-zinc-900 rounded-none">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide text-xl">Login</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                  placeholder="Enter your username"
                                  className="pl-10 bg-zinc-800 border-zinc-700 rounded-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-primary" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  className="pl-10 bg-zinc-800 border-zinc-700 rounded-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-primary" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 uppercase font-bold tracking-wide rounded-none"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-zinc-800 pt-4">
                  <p className="text-sm text-zinc-400">
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0 text-primary" onClick={() => setActiveTab("register")}>
                      Sign up
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <Card className="border-none bg-zinc-900 rounded-none">
                <CardHeader>
                  <CardTitle className="uppercase tracking-wide text-xl">Create Account</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Sign up for a new account to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                  placeholder="Choose a username"
                                  className="pl-10 bg-zinc-800 border-zinc-700 rounded-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-primary" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  className="pl-10 bg-zinc-800 border-zinc-700 rounded-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-primary" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Full Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                className="bg-zinc-800 border-zinc-700 rounded-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary" />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                  <Input
                                    type="password"
                                    placeholder="Create a password"
                                    className="pl-10 bg-zinc-800 border-zinc-700 rounded-none"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-primary" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300 font-medium uppercase text-xs tracking-wide">Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                  <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    className="pl-10 bg-zinc-800 border-zinc-700 rounded-none"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-primary" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 uppercase font-bold tracking-wide rounded-none"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-zinc-800 pt-4">
                  <p className="text-sm text-zinc-400">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 text-primary" onClick={() => setActiveTab("login")}>
                      Sign in
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hero/Promotion Section */}
      <div className="hidden lg:flex flex-col w-1/2 bg-zinc-900 bg-[url('https://dmxg5wxfqgb4u.cloudfront.net/styles/background_image_xl/s3/2021-11/hero-ufc-267-event-page-desktop.jpg?itok=0N1QOnxw')] bg-cover bg-center p-8 justify-center items-center">
        <div className="max-w-md text-center bg-black/60 p-8 backdrop-blur-sm">
          <h2 className="text-4xl font-extrabold mb-6 text-white uppercase tracking-tight">
            <span className="text-primary">Predict.</span> Analyze. <span className="text-primary">Win.</span>
          </h2>
          <p className="text-xl mb-8 text-white">
            Join our premium MMA prediction platform to get AI-powered fight insights, real-time analytics, and expert breakdowns.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/70 backdrop-blur-sm p-6 border-l-4 border-primary">
              <h3 className="font-bold mb-2 uppercase text-white">Fighter Comparison</h3>
              <p className="text-sm text-zinc-300">Compare any two fighters head-to-head with detailed statistics.</p>
            </div>
            <div className="bg-black/70 backdrop-blur-sm p-6 border-l-4 border-primary">
              <h3 className="font-bold mb-2 uppercase text-white">Live Odds</h3>
              <p className="text-sm text-zinc-300">Get real-time betting odds during live events as fights progress.</p>
            </div>
            <div className="bg-black/70 backdrop-blur-sm p-6 border-l-4 border-primary">
              <h3 className="font-bold mb-2 uppercase text-white">AI Predictions</h3>
              <p className="text-sm text-zinc-300">Access cutting-edge AI predictions for upcoming fight outcomes.</p>
            </div>
            <div className="bg-black/70 backdrop-blur-sm p-6 border-l-4 border-primary">
              <h3 className="font-bold mb-2 uppercase text-white">Fight Preparation</h3>
              <p className="text-sm text-zinc-300">Detailed fighter strategy guides and preparation insights.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}