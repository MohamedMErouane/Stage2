"use client"
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Disclosure, Transition } from "@headlessui/react";
import { ConnectedUser } from '@/lib/types';
import ConnectedUsers from './ConnectedUsers'; 

const PopupWidget1 = () => {
  const [showForm, setShowForm] = useState(true); // State to control form visibility
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [showConnectedUsers, setShowConnectedUsers] = useState<boolean>(false); // State to control visibility of ConnectedUsers component

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [Message, setMessage] = useState("");

  const userName = useWatch({ control, name: "name", defaultValue: "Someone" });

  const onSubmit = async (data:any, e:any) => {
    console.log(data);
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data, null, 2),
    })
      .then(async (response) => {
        let json = await response.json();
        if (json.success) {
          setIsSuccess(true);
          setMessage(json.message);
          e.target.reset();
          reset();
        } else {
          setIsSuccess(false);
          setMessage(json.message);
        }
      })
      .catch((error) => {
        setIsSuccess(false);
        setMessage("Client Error. Please check the console.log for more info");
        console.log(error);
      });
  };
  
  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="fixed z-40 flex items-center justify-center transition duration-300 bg-indigo-500 rounded-full shadow-lg right-5 bottom-5 w-14 h-14 focus:outline-none hover:bg-indigo-600 focus:bg-indigo-600 ease"
              onClick={() => setShowForm(!showForm)} // Toggle between form and connectedUsers
            >
              {/* Your button content */}
            </Disclosure.Button>
            <Transition
              className="fixed  z-50 bottom-[100px] top-0 right-0  left-0 sm:top-auto sm:right-5 sm:left-auto"
              enter="transition duration-200 transform ease"
              enterFrom="opacity-0 translate-y-5"
              leave="transition duration-200 transform ease"
              leaveTo="opacity-0 translate-y-5"
            >
              {/* Show form if showForm is true, otherwise show connectedUsers */}
              {showForm ? (
                <Disclosure.Panel>
                  {/* Your form content */}
                </Disclosure.Panel>
              ) : (
                <ConnectedUsers users={users} onClose={() => setShowForm(true)} /> // Pass the users prop to ConnectedUsers
              )}
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default PopupWidget1;
