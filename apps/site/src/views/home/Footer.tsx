import { StrikeLogo } from '@/assets';

export default function Footer() {
  return (
    <footer className="flex sm:flex-row flex-col md:gap-[20px] gap-[32px] sm:justify-between justify-start py-[48px] lg:px-[160px] px-[20px]">
      <a className="flex items-center gap-[4.23px]" href="/">
        <StrikeLogo width={24} height={24} />
        <span className="font-bold font-syne text-[19.64px] leading-[19.64px]">
          STRIKE
        </span>
      </a>
      <div className="flex sm:flex-row flex-col md:gap-[32px] gap-[16px] text-[14px] leading-[24px] font-medium">
        <a href="/privacy">Privacy Policy</a>
        <a href="" target="_blank">
          Visit betBTC
        </a>
        <a href="https://docs.strike.oranj.co/" target="_blank">
          Visit Oranj
        </a>
      </div>
      <div className="font-normal text-[16px] leading-[24px] text-[#717179]">
        <span>© Oranj 2024</span>
      </div>
    </footer>
  );
}
