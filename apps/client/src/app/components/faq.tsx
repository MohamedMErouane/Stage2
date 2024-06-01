import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-black rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-black">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 font-bold text-white dark:text-white bg-indigo-300">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
}

const faqdata = [
  {
    question: " How easy is it to set up the time tracking system?",
    answer: " Setting up our time tracking system is straightforward and quick. Most users can get it up and running within minutes, thanks to our user-friendly interface and comprehensive setup guide",
  },
  {
    question: "Can the system handle a large number of users?",
    answer: "Yes, our system is designed to efficiently manage time tracking for thousands of users, ensuring scalability for businesses of all sizes.",
  },
  {
    question: "Is there a mobile app available? ",
    answer:
      "it will be son as possible.",
  },
  {
    question: "How does the system ensure the accuracy of time tracking? ",
    answer:
      "Our system features automated tracking, real-time updates, and integration with various project management tools to ensure accurate and reliable time tracking.",
  },
];

export default Faq;