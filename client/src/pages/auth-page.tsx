import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { insertUserSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [, setLocation] = useLocation();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      village: "",
      ward: "",
      constituency: "",
      county: "",
      country: "Kenya",
      role: "citizen",
      interests: [],
    },
  });

  const handleLoginSubmit = async (data: any) => {
    try {
      const user = await loginMutation.mutateAsync(data);
      if (user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        setLocation("/");
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleRegisterSubmit = async (data: any) => {
    try {
      await registerMutation.mutateAsync(data);
      toast({
        title: "Registration successful!",
        description: "You can now login with your credentials.",
        duration: 5000,
      });
      setActiveTab("login");
      registerForm.reset();
    } catch (error) {
      // Error handling is already done in the mutation
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Welcome back to Civic Connect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...loginForm.register("email")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Create your Civic Connect account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="r-email">Email</Label>
                    <Input
                      id="r-email"
                      type="email"
                      {...registerForm.register("email")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="r-name">Name</Label>
                    <Input
                      id="r-name"
                      {...registerForm.register("name")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Password</Label>
                    <Input
                      id="r-password"
                      type="password"
                      {...registerForm.register("password")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Register
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:block bg-primary p-8">
        <div className="h-full flex flex-col justify-center text-primary-foreground max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Connect with Your Leaders
          </h1>
          <p className="text-lg">
            Civic Connect brings citizens and leaders together for better governance and
            community engagement. Join us to make your voice heard and participate in
            shaping Kenya's future.
          </p>
        </div>
      </div>
    </div>
  );
}