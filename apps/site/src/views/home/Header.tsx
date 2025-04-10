'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  ConnectDialog,
} from '@oranjlabs/icp-wallet-adapter-react';
import { ICP_BLINK_PREFIX } from '@oranjlabs/strike';
import {
  StrikeLogo,
  LinkIcon,
  MenuIcon,
  CrossIcon,
  ExtensionIcon,
  OranjOrangeIcon,
} from '@/assets';

const StrikeSlider = dynamic(() => import('./StrikeSlider'), { ssr: false });

export default function Header() {
  const router = useRouter();

  const [tempUrl, setTempUrl] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const handlerUnFurlBtnClick = () => {
    if (!tempUrl) return;
    if (ICP_BLINK_PREFIX.test(new URL(tempUrl).searchParams.get('url') ?? '')) {
      const url =
        window.location.origin +
        '/action?url=' +
        new URL(tempUrl).searchParams.get('url');
      router.push(url);
    }
  };

  const handlerMenuIconClick = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <section className="flex md:flex-row flex-col gap-[64px] sm:mt-[32px] lg:pl-[160px] px-[20px] lg:h-screen">
      <div className="flex flex-col justify-between w-full ">
        <div className="relative flex flex-row justify-between lg:py-[0px] py-[24px]">
          <a className="flex flex-row gap-[4.36px] items-center" href="/">
            <StrikeLogo width={24} height={24} />
            <span className="font-syne font-bold text-[19.64px] leading-[19.64px]">
              STRIKE
            </span>
          </a>
          <div className="sm:flex hidden flex-row gap-[16px]">
            <div className="flex flex-row gap-[8px] font-medium items-center text-[14px] leading-[24px]">
              <ExtensionIcon width={20} height={20} />
              <a
                href="https://chromewebstore.google.com/detail/strike-by-oranj/iomlailejogiahpdlmckpjdkipgpfccm "
                target="_blank"
              >
                Get Chrome Extension
              </a>
            </div>
          </div>

          {menuVisible ? (
            <CrossIcon
              width={24}
              height={18}
              className="cursor-pointer sm:hidden"
              onClick={handlerMenuIconClick}
            />
          ) : (
            <MenuIcon
              width={24}
              height={18}
              className="cursor-pointer sm:hidden"
              onClick={handlerMenuIconClick}
            />
          )}
          {menuVisible && (
            <div className="sm:hidden absolute top-full flex flex-col gap-[16px] py-[32px] px-[10px] transition-opacity ease-in-out delay-150 w-full bg-[#FAFAFA] shadow-xl">
              <div className="flex flex-row gap-[8px]">
                <ExtensionIcon width={20} height={20} />
                <a
                  href="https://chromewebstore.google.com/detail/strike-by-oranj/iomlailejogiahpdlmckpjdkipgpfccm "
                  target="_blank"
                >
                  Get Chrome Extension
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:gap-[48px] gap-[32px] sm:pb-[48px] py-[32px]">
          <div className="flex flex-row gap-[12px] xs:py-[10px] items-center">
            <span className="font-normal text-[18px] leading-[27px]">
              Brought you by
            </span>
            <OranjOrangeIcon width={69} height={22} />
          </div>
          <div className="flex flex-col gap-[12px] font-bold font-archivo sm:text-[72px] xs:text-[47px] text-[40px] sm:leading-[72px] leading-[40px] lg:text-left sm:text-center text-left">
            Share actionable
            <div className="flex flex-row lg:justify-between sm:justify-center justify-between items-center">
              links
              <button className="inline-flex justify-center items-center sm:w-[80px] sm:h-[52px] w-[48px] h-[32px] bg-[#3670FF] text-white rounded-[12px] sm:mx-[16px] mx-[8px]">
                <LinkIcon className="sm:w-[24px] sm:h-[24px] w-[12.3px] h-[12.3px]" />
              </button>
              with ease
            </div>
            <span>powered by ICP</span>
          </div>
          <div className="font-normal text-[18px] text-[#27272A] leading-[27px] ">
            <p className="text-left">
              STRIKE helps users share links that convert into STRIKE Cards,
              making it simple to interact and perform actions on social media.
            </p>
          </div>
          <div className="flex sm:flex-row flex-col justify-between sm:gap-[48px] gap-[16px]">
            <input
              type="text"
              className="outline-none w-full rounded-[12px] border-[1px] border-[#D4D4D8] py-[12px] px-[14px]"
              placeholder="Enter URL to unfurl"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
            />
            <button
              className="bg-[#3670FF] text-white py-[12px] px-[18px] border-1 rounded-[12px] border-[#2B5ACC] font-semibold text-[16px] leading-[24px]"
              onClick={handlerUnFurlBtnClick}
            >
              Unfurl
            </button>
          </div>
        </div>
      </div>
      <div className="w-full sm:block hidden">
        <div className="lg:h-[777px] w-full flex md:flex-row flex-col gap-[20px]">
          <StrikeSlider />
        </div>
      </div>
      <ConnectDialog />
    </section>
  );
}
