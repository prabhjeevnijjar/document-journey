"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
import { OTPInput } from "@/components/OtpInput";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  // State for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // State for errors
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validation helpers
  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePassword = (value: string) =>
    value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

  const handleFormValidation = () => {
    let valid = true;

    // Name must not be empty and must only contain letters and spaces
    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
      setFullNameError("Name should only contain letters and spaces.");
      valid = false;
    } else {
      setFullNameError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include a letter and a number."
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleOtpComplete = (value: string) => {
    console.log("OTP completed:", value);
    // Handle OTP completion logic here
  };

  const handleSendOtp = async () => {
    // Simulate sending OTP id all firld are valid
    console.log("Sending OTP to email:", email, { showOtpField });
    if (handleFormValidation()) {
      setIsLoading(true);
      const data = {
        fullName,
        email,
        password,
        confirmPassword,
      };
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, data)
        .then((response) => {
          if (response.status === 200 && response.data.status === "success") {
            console.log("OTP sent!");
            console.log({ response });
            setShowOtpField(true);

            toast.success("OTP sent to your email!");
          }
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
          toast.error(
            error.response?.data?.message
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCreateAccount = async () => {
    console.log("Creating account with OTP:", otp);
    //verify otp
    setIsLoading(true);
    const data = {
      email,
      otp,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200 && response.data.status === "success") {
          console.log({ response });
          toast.success("Account created successfully!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);

          setIsLoading(false);
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setOtp("");
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        // resetForm();
      });
  };

  const handleResendOtp = () => {
    // Logic to resend OTP
    console.log("OTP resent!");
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setShowOtpField(false);
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };
  console.log("showOtpField", showOtpField);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={showOtpField}
                  />
                  {fullNameError && (
                    <p className="text-sm text-red-500">{fullNameError}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="flex-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showOtpField}
                    />
                  </div>{" "}
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={showOtpField}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={showOtpField}
                  />
                  {confirmPasswordError && (
                    <p className="text-sm text-red-500">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
                {showOtpField && (
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Email Verification Code</Label>
                    <div className="flex flex-col gap-2">
                      <OTPInput
                        length={6}
                        value={otp}
                        onChange={handleOtpChange}
                        onComplete={handleOtpComplete}
                        className="justify-center"
                      />
                      <p className="text-sm text-muted-foreground text-center">
                        Enter the 6-digit code sent to your email
                      </p>
                      {/* Didn&apos;t receive the code?  */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={handleSendOtp}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  className="w-full"
                  disabled={showOtpField && otp.length !== 6}
                  onClick={() =>
                    showOtpField ? handleCreateAccount() : handleSendOtp()
                  }
                >
                  <>
                    {isLoading && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {!showOtpField ? "Send OTP" : "Create Account"}
                  </>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={resetForm}
                >
                  Reset Form
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
