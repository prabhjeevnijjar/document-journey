"use client";

import type React from "react";
import { useState } from "react";
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

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleOtpComplete = (value: string) => {
    console.log("OTP completed:", value);
    // Handle OTP completion logic here
  };

  const handleSendOtp = () => {
    // Simulate sending OTP
    setShowOtpField(true);
    console.log("OTP sent!");
  };

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
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
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
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendOtp}
                      disabled={showOtpField}
                    >
                      {showOtpField ? "Sent" : "Send OTP"}
                    </Button>
                  </div>
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={handleSendOtp}
                      >
                        Didn&apos;t receive the code? Resend
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={showOtpField && otp.length !== 6}
                >
                  Create Account
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
