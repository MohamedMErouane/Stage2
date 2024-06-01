import Image from "next/image";
import React from "react";
import Container from "../components/container";

import userOneImg from "../../../public/ana.jpg";
import userTwoImg from "../../../public/ana2.png";
import userThreeImg from "../../../public/ana1.png";

const Testimonials  = () => {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal text-black ">
            Tracking time for my entire team used to be a nightmare. This system<Mark>has simplified</Mark>
            everything, saving us hours each week.
            </p>

            <Avatar
              image={userOneImg}
              name="Amine"
              title="Manager of Stryve"
            />
          </div>
        </div>
        <div className="">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal text-black ">
            This tool is a game-changer. It's incredibly user-friendly and has made our time tracking <Mark>more accurate</Mark>
            and efficient.
            </p>

            <Avatar
              image={userTwoImg}
              name="Abdalah Nait ouahman"
              title="Lead marketer "
            />
          </div>
        </div>
        <div className="">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal text-black ">
            We've tried several time tracking solutions, but nothing <Mark> compares to this system's</Mark> ease of use and reliability. 
            </p>

            <Avatar
              image={userThreeImg}
              name="Mellouki Rida"
              title="leader of devlopeur"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

function Avatar(props:any) {
  return (
    <div className="flex items-center mt-8 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props:any) {
  return (
    <>
      {" "}
      <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
        {props.children}
      </mark>{" "}
    </>
  );
}

export default Testimonials;