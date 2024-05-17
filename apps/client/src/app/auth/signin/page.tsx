"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";


import React, { SyntheticEvent, useState } from 'react';
import { Input } from "@nextui-org/react";
import Appbar from "../../components/Appbar";


interface Props {
    callbackUrl?: string;
  }

  const FormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string({
      required_error: "Please enter your password",
    }),
  });
  
  type InputType = z.infer<typeof FormSchema>;

const SignInForm = (props: Props) => {

    const googleSignIn = async () => {
        const result = await signIn("google", {
          callbackUrl: "/",
        });
        console.log({ result });
      };

    const router = useRouter();
  const [visiblePass, setVisiblePass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      });
  
      console.log(result); // Log the result to see its structure
  
      if (result && result.ok) {
        toast.success("Welcome To Study With Me Website");
        console.log("Redirecting to /home...");
        router.push("/home");
      } else {
        const errorMessage = result?.error || "An error occurred during sign-in.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error occurred during sign-in:", error);
      toast.error("An error occurred during sign-in. Please try again later.");
    }
  };
  

  return (
    
  <><div className="bg-white"> 
          <Appbar />
      
      <div className=" mt-40">

              <div className="flex-1 flex justify-center items-center bg-white">
                  <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
                      <h1 className="text-3xl mb-4 font-poppins font-semibold text-center text-black">Login</h1>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div>
                              <Input
                                  {...register("email")} errorMessage={errors.email?.message}
                                  placeholder="Email"
                                  className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black" />
                          </div>
                          <div className="relative">
                              <input
                                  placeholder="Password"
                                  className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
                                  {...register("password")}
                                  type={visiblePass ? "text" : "password"} />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
                                      {visiblePass ? <EyeSlashIcon className="w-4" /> : <EyeIcon className="w-4" />}
                                  </button>
                              </div>
                          </div>
                          <button
                              type="submit"
                              className="w-full bg-indigo-500 text-white rounded-md py-3 font-semibold transition duration-300 hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-600"
                          >
                              Login
                          </button>
                      </form>
                      <div className="mt-4 text-center">
                          <p><Link href={"/auth/forgotPassword"} className="font-medium text-black hover:underline">Forget password?</Link></p>
                      </div>
                      
                    
                  </div>
              </div>
          </div></div></>
  );
};

export default SignInForm;
