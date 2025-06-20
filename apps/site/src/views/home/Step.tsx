import Link from 'next/link';

export default function Step() {
  return (
    <section className="flex flex-col md:gap-[96px] gap-[48px] font-medium lg:py-[96px] py-[48px] lg:px-[160px] px-[20px]">
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[12px] sm:text-center text-left">
          <a className="text-[#3670FF] text-[16px] leading-[24px]" href="/">
            Steps
          </a>
          <p className="sm:text-[48px] text-[32px] font-bold sm:leading-[60px] leading-[40px] font-archivo">
            How STRIKE works
          </p>
        </div>
        <div>
          <p className="text-[18px] leading-[27px] font-normal text-center">
            Let's explore how STRIKE operates to better understand its
            operation.
          </p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col sm:gap-[32px] gap-[16px] font-normal">
        <div className="rounded-[12px] sm:p-[32px] p-[16px] flex flex-col gap-[32px] bg-[#FFFFFF] md:w-1/3 w-full ">
          <div className="flex justify-center items-center w-[64px] h-[64px] rounded-[12px] border-2] bg-[#F4F4F5]">
            <span className="sm:text-[30px] text-[24px] leading[38px] font-sans font-medium">
              1
            </span>
          </div>
          <div className="flex flex-col gap-[12px] justfiy-between text-left">
            <p className="sm:text-[24px] text-[20px] leading-[32px] font-bold font-archivo">
              Install the Chrome Extension
            </p>
            <p className="text-[16px] leading-[24px] font-normal text-left text-[#45484F]">
              Download the STRIKE Chrome extension to authenticate and interact
              with STRIKE-supported platforms via the Internet Computer Protocol
              (ICP).
            </p>
          </div>
        </div>
        <div className="rounded-[12px] sm:p-[32px] p-[16px] flex flex-col gap-[32px] bg-[#FFFFFF] md:w-1/3 w-full ">
          <div className="flex justify-center items-center w-[64px] h-[64px] rounded-[12px] border-2] bg-[#F4F4F5]">
            <span className="sm:text-[30px] text-[24px] leading[38px] font-sans font-medium">
              2
            </span>
          </div>
          <div className="flex flex-col gap-[12px] justfiy-between text-left">
            <p className="sm:text-[24px] text-[20px] leading-[32px] font-bold font-archivo">
              Create and Host the Actions File
            </p>
            <p className="text-[16px] leading-[24px] font-normal text-left text-[#45484F]">
              Define actions in a JSON file, host it publicly, and test it using
              the STRIKE website to preview the actions before sharing.
            </p>
          </div>
        </div>
        <div className="rounded-[12px] sm:p-[32px] p-[16px] flex flex-col gap-[32px] bg-[#FFFFFF] md:w-1/3 w-full ">
          <div className="flex justify-center items-center w-[64px] h-[64px] rounded-[12px] border-2] bg-[#F4F4F5]">
            <span className="sm:text-[30px] text-[24px] leading[38px] font-sans font-medium">
              3
            </span>
          </div>
          <div className="flex flex-col gap-[12px] justfiy-between text-left">
            <p className="sm:text-[24px] text-[20px] leading-[32px] font-bold font-archivo">
              Share and Engage with STRIKE Cards
            </p>
            <p className="text-[16px] leading-[24px] font-normal text-left text-[#45484F]">
              Share your hosted link on platforms like X (formerly Twitter),
              where it will unfurl into a STRIKE Card for users to interact with
              your canister actions, powered by ICP.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <Link href="/register">
          <button className="rounded-md text-base leading-4 bg-[#3670FF] text-white p-4 font-semibold font-inter hover:brightness-125 text-white/90">
            Click Here to register your canister
          </button>
        </Link>
      </div>
    </section>
  );
}
