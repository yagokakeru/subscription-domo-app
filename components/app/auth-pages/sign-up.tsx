"use client"

import { useAtomValue } from "jotai";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "@/app/(auth-pages)/smtp-message";
import { priceIdAtom } from "@/lib/atoms/handOver";
import { useSignupFrom } from "@/lib/validation/hooks";

export function SignUpForm({ message }: { message: Message; }) {
  const priceID = useAtomValue(priceIdAtom);
  const { form, onSubmit } = useSignupFrom();

  if ("message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input {...form.register("priceid")} type="hidden" value={priceID} />
          <Label htmlFor="email">Email</Label>
          <Input {...form.register("email")} placeholder="you@example.com" autoComplete={"email"} />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
          )}

          <Label htmlFor="password">Password</Label>
          <Input
            {...form.register("password")}
            type="password"
            placeholder="Your password"
            autoComplete={"current-password"}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
          )}
          
          <SubmitButton pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={message} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
