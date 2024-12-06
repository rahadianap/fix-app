"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("password", password);

      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/login`, formData)
        .then((response) => {
          setIsLoading(false);
          Cookies.set("token", response.data.token, { expires: 1 });
          if (response.data.data.role === "security") {
            router.push("/setting");
          } else {
            router.push("/dashboard");
          }
        })
        .catch((error: any) => {
          setIsLoading(false);
          setValidation(error.response.data);
        });
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-emerald-500" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Acme Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </CardTitle>
          </CardHeader>
          <CardContent className="m-4">
            <p className="text-sm text-muted-foreground">
              Enter your username and password below to sign in to your account
            </p>
            {validation.message && (
              <Alert variant="destructive" className="mb-4 mt-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{validation.message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={(e) => handleLogin(e)}>
              <div className="grid gap-4 mt-4">
                <div className="grid gap-1">
                  <Input
                    id="name"
                    placeholder="Username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {validation.name && (
                  <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{validation.name[0]}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-1">
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {validation.password && (
                  <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {validation.password[0]}
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-500 hover:bg-emerald-700"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
