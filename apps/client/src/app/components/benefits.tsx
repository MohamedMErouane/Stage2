import Image from "next/image";
import React from "react";
import Container from "./container";

const Benefits = (props: { imgPos?: any; data?: any }) => {
  const { data } = props;

  // Check if data exists before accessing its properties
  if (!data) {
    return null; // or handle the case when data is undefined or null
  }

  return (
    <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap bg-white ">
      <div
        className={`flex items-center justify-center w-full lg:w-1/2 ${
          props.imgPos === "right" ? "lg:order-1" : ""
        }`}
      >
        <div>
          {/* Check if data.image exists before accessing its properties */}
          {data.image && (
            <Image
              src={data.image}
              width={521}
              alt="Benefits"
              className={"object-cover"}
              placeholder="blur"
              // Check if data.image.src exists before accessing it
              blurDataURL={data.image.src ? data.image.src : undefined}
            />
          )}
        </div>
      </div>

      <div
        className={`flex flex-wrap items-center w-full lg:w-1/2 ${
          data.imgPos === "right" ? "lg:justify-end" : ""
        }`}
      >
        <div>
          <div className="flex flex-col w-full mt-4">
            <h3 className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl dark:text-black">
              {data.title}
            </h3>

            <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-900">
              {data.desc}
            </p>
          </div>

          <div className="w-full mt-5">
            {/* Check if data.bullets exists and is an array before mapping */}
            {data.bullets && Array.isArray(data.bullets) ? (
              data.bullets.map((item: any, index: number) => (
                <Benefit key={index} title={item.title} icon={item.icon}>
                  {item.desc}
                </Benefit>
              ))
            ) : (
              <p>No bullets found</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

function Benefit(props: { icon: React.DetailedReactHTMLElement<{ className: string; }, HTMLElement>; title: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; children: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) {
  return (
    <div className="flex items-start mt-8 space-x-3">
      <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-indigo-500 rounded-md w-11 h-11 ">
        {React.cloneElement(props.icon, {
          className: "w-7 h-7 text-indigo-50",
        })}6
      </div>
      <div>
        <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200">
          {props.title}
        </h4>
        <p className="mt-1 text-gray-500 dark:text-gray-700">
          {props.children}
        </p>
      </div>
    </div>
  );
}

export default Benefits;
