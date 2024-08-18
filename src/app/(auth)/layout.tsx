import Image from "next/image";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="w-full h-screen flex p-4 rounded-xl lg:dark:bg-blackrelative gap-2">
      <div className="lg:w-[64%] h-full hidden lg:block relative">
        <div className="w-full h-full ">
          <Image
            src="/authbg.jpg"
            alt="bg-auth"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="w-full lg:w-[36%] h-full p-2 flex flex-col justify-center  rounded-xl">
        {children}
      </div>
    </section>
  );
};

export default Layout;

// lg:bg-none bg-auth-bg bg-cover bg-center
