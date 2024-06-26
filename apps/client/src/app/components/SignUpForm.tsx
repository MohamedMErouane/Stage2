'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoMdSchool } from "react-icons/io";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { z } from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(45, "First name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed!"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(45, "Last name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed!"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .refine((value) => validator.isMobilePhone(value), "Please enter a valid phone number!"),
    isAdmin: z.boolean().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password do not match!",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const SignupForm = () => {
  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const [passStrength, setPassStrength] = useState(0);
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State for admin checkbox

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch]);

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    try {
      // Omit unwanted properties from user data
      const { confirmPassword, accepted, ...userData } = data;
      // Include isAdmin property
      userData.isAdmin = isAdmin;

      const result = await registerUser(userData);
      toast.success("The User Registered Successfully.");
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.error("Failed to register user:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 mt-5 mb-5 w-128 flex justify-center items-center bg-white">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-4 font-poppins font-semibold text-center text-black">Sign Up</h1>
          <form onSubmit={handleSubmit(saveUser)} className="space-y-4">
            <div>
              <Input
                errorMessage={errors.firstName?.message}
                isInvalid={!!errors.firstName}
                {...register("firstName")}
                startContent={<UserIcon className="w-4" />}
                placeholder="First Name"
                className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <Input
                errorMessage={errors.lastName?.message}
                isInvalid={!!errors.lastName}
                {...register("lastName")}
                startContent={<UserIcon className="w-4" />}
                placeholder="Last Name"
                className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <Input
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
                {...register("email")}
                startContent={<EnvelopeIcon className="w-4" />}
                placeholder="Email"
                className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <Input
                errorMessage={errors.phone?.message}
                isInvalid={!!errors.phone}
                {...register("phone")}
                startContent={<PhoneIcon className="w-4" />}
                placeholder="Phone"
                className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <Input
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
                {...register("password")}
                type={isVisiblePass ? "text" : "password"}
                placeholder="Password"
                className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
                startContent={<KeyIcon className="w-4" />}
                endContent={
                  isVisiblePass ? (
                    <EyeSlashIcon
                      className="w-4 cursor-pointer"
                      onClick={toggleVisiblePass}
                    />
                  ) : (
                    <EyeIcon
                      className="w-4 cursor-pointer"
                      onClick={toggleVisiblePass}
                    />
                  )
                }
              />
            </div>
            <PasswordStrength passStrength={passStrength} />
            <div>
              <Input
                errorMessage={errors.confirmPassword?.message}
                isInvalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
                type={isVisiblePass ? "text" : "password"}
                startContent={<KeyIcon className="w-4" />}
                placeholder="Confirm Password"
                className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <Checkbox
                onChange={(e) =>  setIsAdmin(e.target.checked)}
                checked={isAdmin}
                className="col-span-2 text-black"
              >
                Sign up as Admin
              </Checkbox>
            </div>
            <div>
              <Controller
                control={control}
                name="accepted"
                render={({ field }) => (
                  <Checkbox
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="col-span-2 text-black"
                  >
                    I Accept The <Link href="/terms">Terms</Link>
                  </Checkbox>
                )}
              />
            </div>
            {!!errors.accepted && (
              <p className="text-red-500">{errors.accepted.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md py-3 font-semibold transition duration-300 hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-600"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <p><a href="#" className="font-medium text-black hover:underline">Forget password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;