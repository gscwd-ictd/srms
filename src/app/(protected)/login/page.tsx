"use client";

import Logo2BigSvg from "@srms/components/ui-custom/Svg/logo2Big/logo2BigSvg";
import MapBackgroundSvg from "@srms/components/ui-custom/Svg/mapBackground/mapBackgroundSvg";
import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LogIn } from "@srms/components/types";
import { toast } from "sonner";
import { postAuth } from "@srms/components/helpers/auth-helper";

export default function LoginPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogIn>({
    defaultValues: {
      email: "allynjosephcubero@gscwd.com", // remove on production
      password: "password", // remove on production
      appSecret: process.env.NEXT_PUBLIC_AUTH_APP_SECRET,
    },
  });

  const successToast = (message: string) => {
    toast.success("Success!", {
      description: message,
      position: "top-center",
    });
  };

  const errorToast = (message: string) => {
    toast.error("An Error Has Occurred", {
      description: message,
      position: "top-center",
    });
  };

  const onSubmit = async (data: LogIn) => {
    const { error, result } = await postAuth(data);

    if (error) {
      errorToast(result);
    } else {
      successToast("Credentials verified");

      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="font-inter relative min-h-screen w-full bg-white">
      {/* Animated GIS-style SVG background */}
      <MapBackgroundSvg />

      {/* Centered login modal */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-3xl grid-cols-1 items-center gap-8 md:grid-cols-2">
          {/* left: info / branding */}
          <aside className="hidden flex-col justify-center pr-6 pl-8 md:flex">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3">
                <Logo2BigSvg />
                <div>
                  <h1 className="text-2xl font-semibold text-[#0b2340]">2BIG</h1>
                  <p className="text-sm text-[#0b2340]/70">Operations Monitoring & Management System</p>
                </div>
              </div>
            </div>

            <h2 className="mb-3 text-3xl leading-tight font-bold text-[#0b2340]">Welcome back</h2>
            <p className="text-[#0b2340]/70">
              Sign in to access GSCWD data loggers, vehicles, and pipelines.
            </p>

            <ul className="mt-4 space-y-3 text-sm whitespace-nowrap text-[#0b2340]/70">
              <li>• Data loggers</li>
              <li>• Vehicle locations</li>
              <li>• Pipeline layout</li>
            </ul>
          </aside>

          {/* right: form */}
          <section className="border-primary-color/8 rounded-2xl border bg-white/95 p-8 shadow-2xl backdrop-blur-md md:p-10 dark:bg-white/90">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#0b2340]">Log In</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0b2340]/80">Email</label>
                <input
                  required
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="border-primary-color/20 focus:ring-primary-color/30 w-full rounded-lg border px-4 py-3 text-black focus:ring-2 focus:outline-none"
                  placeholder="first&lastname@gscwd.com"
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0b2340]/80">Password</label>
                <div className="relative">
                  <input
                    required
                    type={`${isShowPassword ? "text" : "password"}`}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="border-primary-color/20 focus:ring-primary-color/30 w-full rounded-lg border px-4 py-3 text-black focus:ring-2 focus:outline-none"
                    placeholder="Enter your password"
                  ></input>
                  <label className="absolute inset-y-0 right-3 flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer hidden"
                      onChange={() => {
                        setIsShowPassword(!isShowPassword);
                      }}
                      defaultChecked={true}
                    />

                    <Eye className="primary-text-color mr-2 block w-5 cursor-pointer peer-checked:hidden" />
                    <EyeClosed className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
                  </label>
                  {errors.password && <p>{errors.password.message}</p>}
                </div>
              </div>

              {/* <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-[#0b2340]/70">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#2b85ff]" />
                  Remember me
                </label>
                <a href="#" className="text-[#2b85ff]">
                  Forgot password?
                </a>
              </div> */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full rounded-lg bg-gradient-to-tr from-blue-600/80 via-blue-400/80 to-sky-400/80 py-3 font-semibold text-white transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* small footer */}
      <footer className="absolute bottom-4 left-6 z-10 text-xs text-[#0b2340]/60">
        © {new Date().getFullYear()} OMMS
      </footer>
    </div>
  );
}
