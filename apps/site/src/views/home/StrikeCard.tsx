import { StrikeLogo, BetBTCIcon, TelegramIcon, TwitterIcon } from '@/assets';

export default function StrikeCard({ image }: { image?: string }) {
  return (
    <div className="flex flex-col gap-[16px] p-[16px] rounded-[6px] bg-[#F4F4F5]">
      <div className="flex flex-row gap-[1px] items-center leading-[9.82px] text-[9.82px] font-medium">
        <StrikeLogo width={12} height={12} />
        <span className="font-syne font-bold">STRIKE</span>
      </div>
      <div className="flex flex-col gap-[8px] p-[8px] rounded-[6px] bg-[#FAFAFA] relative">
        <p className="font-normal text-[8px] leading-[12px] font-inter">
          Who will become the next President of the United States?
        </p>
        <div className="relative">
          <img
            src={image ? image : 'card0.png'}
            className="rounded-[6px] max-w-[240px] max-h-[232px]"
            alt="CardImg"
          />
          <div className="flex gap-[8px] absolute right-[4px] bottom-[4px]">
            <div className="bg-[#121212] p-[4px] rounded-[4px]">
              <BetBTCIcon width={46} height={12} />
            </div>
            <div className="bg-[#121212] p-[5px] rounded-[4px]">
              <TelegramIcon width={10} height={10} />
            </div>
            <div className="flex  bg-[#121212] p-[4px] rounded-[4px]">
              <TwitterIcon width={10} height={10} />
            </div>
          </div>
        </div>
      </div>
      <button className="rounded-[6px] text-[8px] leading-[12px] bg-[#3670FF] text-white px-[9px] py-[6px] font-semibold font-inter">
        Click Here to Bet
      </button>
    </div>
  );
}