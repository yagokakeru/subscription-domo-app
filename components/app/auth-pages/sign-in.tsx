"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLoginFrom } from "@/lib/validation/hooks";

export function LoginForm({ message }: { message: Message }) {
  const { form, onSubmit } = useLoginFrom();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 flex flex-col min-w-64"
    >
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        {"Don't have an account?"}{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input {...form.register("email")} placeholder="you@example.com" />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          {...form.register("password")}
          type="password"
          placeholder="Your password"
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}

        <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
        <FormMessage message={message} />
      </div>
    </form>
  );
}
