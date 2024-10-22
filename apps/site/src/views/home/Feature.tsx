import Image from 'next/image';
import { CheckBoxIcon, VerifyIcon } from '@/assets';

export default function Feature() {
  return (
    <section className="flex md:flex-row flex-col gap-[64px] items-center font-normal lg:py-[96px] py-[48px] lg:px-[160px] px-[20px]">
      <div className="flex flex-col gap-[16px] w-full">
        <div className="flex flex-col gap-[12px] font-medium text-left">
          <a className="text-[#3670FF] text-[16px] leading-[24px]" href="/">
            Features
          </a>
          <p className="sm:font-sans font-archivo sm:text-[48px] sm:font-medium font-bold text-[32px] leading-[60px]">
            Features of STRIKE
          </p>
        </div>
        <div>
          <p className="text-[18px] leading-[27px] text-left">
            STRIKE empowers users to share actionable links that interact with
            canisters on the Internet Computer Protocol (ICP). With STRIKE,
            users can perform secure and efficient actions directly from social
            platforms, making decentralized interactions easy and accessible.
          </p>
        </div>
        <div className="flex flex-col gap-[16px] font-normal">
          <div className="flex gap-[12px] text-[16px] leading-[24px] items-center">
            <CheckBoxIcon height={21} width={21} />
            <span>Powered by ICP for fast, decentralized performance</span>
          </div>
          <div className="flex gap-[12px] text-[16px] leading-[24px] items-center">
            <CheckBoxIcon height={21} width={21} />
            <span>
              Interactive STRIKE Cards that unfurl with actionable content
            </span>
          </div>
          <div className="flex gap-[12px] text-[16px] leading-[24px] items-center">
            <CheckBoxIcon height={21} width={21} />
            <span>Embed custom actions with simple JSON integration</span>
          </div>
          <div className="flex gap-[12px] text-[16px] leading-[24px] items-center">
            <CheckBoxIcon height={21} width={21} />
            <span>
              Share directly to social media platforms like Twitter (X)
            </span>
          </div>
        </div>
      </div>
      <div className="lg:px-[88px] px-[40px] lg:py-[112px]">
        <div className="relative flex flex-col gap-[20px] rounded-[12px] p-[12px] bg-[#F4F4F5]">
          <Image
            src={'/hello-strike.png'}
            alt="card"
            width={336}
            height={320}
            className="rounded-[8px] sm:max-w-[336px] border-[1px] border-[#E4E4E7]"
          />
          <div className="flex flex-col gap-[12px] font-normal">
            <div className="flex flex-row gap-[8px]">
              <p className="text-[#3F3F45] text-[10px] leading-[15px]">
                ea6rm-nyaaa-aaaak-ak2wa-cai
              </p>
              <VerifyIcon width={12} height={12} />
            </div>
            <div className="flex flex-col">
              <p className="text-[#121212] text-[16px] leading-[24px] font-semibold">
                Simple ownership
              </p>
              <p className="text-[#27272A] text-[12px] leading-[18px]">
                demo canister integration with STRIKE
              </p>
            </div>
            <div className="flex flew-row gap-[10px] text-[12px] leading-[18px] font-semibold text-white w-full">
              <button className="bg-[#121212] px-[16px] py-[8px] rounded-[8px] w-1/2">
                Hello
              </button>
              <button className="bg-[#121212] px-[16px] py-[8px] rounded-[8px] w-1/2">
                Get Owner
              </button>
            </div>
            <div className="flex flex-row gap-[8px] justify-between">
              <input
                className="rounded-[8px] border-[1px] border-[#D4D4D8] p-[8px] text-[12px] leading-[18px] outline-none w-full"
                placeholder="Enter a new owner"
                disabled
              />
              <button className="rounded-[8px] px-[16px] py-[8px] border-[1px] border-[#2B5ACC] bg-[#3670FF] text-white font-semibold text-[12px] leading-[18px] whitespace-nowrap">
                Set Owner
              </button>
            </div>
          </div>
          <button className="border-[1px] border-[#E4E4E7] rounded-[32px] py-[4px] px-[8px] bg-[#FAFAFA] text-[#3670FF] absolute  sm:top-[170px] top-[120px] left-[-17px] text-[10px] leading-[15px] font-medium">
            Powered by ICP
          </button>
          <button className="border-[1px] border-[#E4E4E7] rounded-[32px] py-[4px] px-[8px] bg-[#FAFAFA] text-[#3670FF] absolute sm:top-[250px] top-[180px] left-[-32px] text-[10px] leading-[15px] font-medium">
            Embedded custom actions
          </button>
          <button className="border-[1px] border-[#E4E4E7] rounded-[32px] py-[4px] px-[8px] bg-[#FAFAFA] text-[#3670FF] absolute  sm:top-[170px] top-[120px] right-[-41px] text-[10px] leading-[15px] font-medium">
            Interactive STRIKE Cards
          </button>
          <button className="border-[1px] border-[#E4E4E7] rounded-[32px] py-[4px] px-[8px] bg-[#FAFAFA] text-[#3670FF] absolute sm:top-[250px] top-[180px] right-[-40px] text-[10px] leading-[15px] font-medium">
            Share directly
          </button>
        </div>
      </div>
    </section>
  );
}
