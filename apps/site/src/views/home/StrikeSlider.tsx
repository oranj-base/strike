import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import StrikeCard from './StrikeCard';
import useWindowSize from '@/hook/useWindowSize';

export default function StrikeSlider() {
  const { width } = useWindowSize();
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: width >= 768 ? 2 : 1,
    slidesToScroll: 1,
    pauseOnFocus: false,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    autoplay: true,
    speed: 8000,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    vertical: width >= 1024 ? true : false,
    verticalSwiping: true,
  };
  return (
    <>
      <Slider
        className="slider-container m-0 p-0 md:w-[288px] w-full"
        {...settings}
      >
        <StrikeCard
          key={0}
          image="card1.png"
          text="Will China lift Bitcoin ban by 2025?"
        />
        <StrikeCard
          key={1}
          image="card2.png"
          text="Will Bitcoin reach all time high in 2024?"
        />
      </Slider>
      <Slider
        className="slider-container m-0 p-0 md:w-[288px] w-full"
        {...settings}
        rtl={true}
      >
        <StrikeCard
          key={0}
          image="card3.png"
          text="Who will become the next President of the United States?"
        />
        <StrikeCard
          key={1}
          image="card4.png"
          text="Which club win the UEFA UCL 2024-25?"
        />
      </Slider>
    </>
  );
}
