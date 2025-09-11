import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import type { InsertUser, LoginUser } from "@shared/schema";
import { useLogin, useRegister } from "../lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CalendarHeart, Shield } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const login = useLogin();
  const register = useRegister();

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerSchema = insertUserSchema.extend({
    confirmPassword: insertUserSchema.shape.password,
  });

  const registerForm = useForm<typeof registerSchema._input>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginUser) => {
    try {
      await login.mutateAsync(data);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    }
  };

  const onRegisterSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    const { confirmPassword, ...userData } = data;
    
    try {
      await register.mutateAsync(userData);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Unable to create account. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* App Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <CalendarHeart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FlowTracker</h1>
          <p className="text-muted-foreground">Your personal period companion</p>
        </div>

        <Card>
          <CardHeader>
            {/* Auth Toggle Tabs */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <Button
                variant={isLogin ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setIsLogin(true)}
                data-testid="tab-login"
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setIsLogin(false)}
                data-testid="tab-register"
              >
                Register
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {isLogin ? (
              /* Login Form */
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    data-testid="input-email"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    data-testid="input-password"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={login.isPending}
                  data-testid="button-login"
                >
                  {login.isPending ? "Signing In..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    data-testid="input-name"
                    {...registerForm.register("name")}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    data-testid="input-register-email"
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a password"
                    data-testid="input-register-password"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    data-testid="input-confirm-password"
                    {...registerForm.register("confirmPassword")}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="privacy-agree" data-testid="checkbox-privacy" />
                  <Label htmlFor="privacy-agree" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={register.isPending}
                  data-testid="button-register"
                >
                  {register.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-secondary mt-1" />
            <div className="text-sm text-muted-foreground">
              <strong>Your privacy is our priority.</strong> All your data is encrypted and stored
              securely. We never share your personal information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
