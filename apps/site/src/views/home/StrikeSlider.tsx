import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import StrikeCard from './StrikeCard';
import { Autoplay } from 'swiper/modules';

export default function StrikeSlider() {
  return (
    <>
      <Swiper
        direction={'horizontal'}
        autoplay={{ delay: 0 }}
        loop={true}
        slidesPerView={2}
        freeMode={true}
        breakpoints={{
          1024: {
            direction: 'vertical',
          },
        }}
        spaceBetween={30}
        speed={8000}
        modules={[Autoplay]}
        className="mySwiper slider-container m-0 p-0 md:w-[288px] w-full"
      >
        <SwiperSlide>
          <StrikeCard
            key={0}
            image="card1.png"
            text="Will China lift Bitcoin ban by 2025?"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StrikeCard
            key={1}
            image="card2.png"
            text="Will Bitcoin reach all time high in 2024?"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StrikeCard
            key={0}
            image="card1.png"
            text="Will China lift Bitcoin ban by 2025?"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StrikeCard
            key={1}
            image="card2.png"
            text="Will Bitcoin reach all time high in 2024?"
          />
        </SwiperSlide>
      </Swiper>
      <Swiper
        direction={'horizontal'}
        breakpoints={{
          1024: {
            direction: 'vertical',
          },
        }}
        autoplay={{ delay: 0, reverseDirection: true }}
        loop={true}
        slidesPerView={2}
        spaceBetween={30}
        speed={8000}
        modules={[Autoplay]}
        className="mySwiper slider-container m-0 p-0 md:w-[288px] w-full"
      >
        <SwiperSlide>
          <StrikeCard
            key={0}
            image="card3.png"
            text="Who will become the next President of the United States?"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StrikeCard
            key={1}
            image="card4.png"
            text="Which club win the UEFA UCL 2024-25?"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StrikeCard
            key={0}
            image="card3.png"
            text="Who will become the next President of the United States?"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StrikeCard
            key={1}
            image="card4.png"
            text="Which club win the UEFA UCL 2024-25?"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
