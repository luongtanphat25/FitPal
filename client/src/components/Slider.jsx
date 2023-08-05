//packages being tested out

import moment from "moment";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/Slider.css";

const mockWorkouts = [
  {
    exercise: "Push-ups",
    date: "2023-08-01",
    icon: "https://example.com/push-ups-icon.png",
  },
  {
    exercise: "Squats",
    date: "2023-08-02",
    icon: "https://example.com/squats-icon.png",
  },
  {
    exercise: "Pull-ups",
    date: "2023-08-03",
    icon: "https://example.com/pull-ups-icon.png",
  },
  {
    exercise: "Planks",
    date: "2023-08-04",
    icon: "https://example.com/planks-icon.png",
  },
  {
    exercise: "Burpees",
    date: "2023-08-05",
    icon: "https://example.com/burpees-icon.png",
  },
];

const SliderItem = ({ exercise, date, icon }) => {
  return (
    <div className="slider-item" >
      <img src={icon} alt={exercise} className="exercise-icon" />
      <h3 className="exercise">{exercise}</h3>
      <p className="date">{moment(date).format("dddd, MMMM D")}</p>
    </div>
  );
};

const SliderComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="slider-container bg-dark">
      {/* Apply custom background color and text color to the slider container */}
      <h2 className="slider-title text-warning">Program Schedule</h2>
      <Slider {...settings}>
        {mockWorkouts.map((workout, index) => (
          <SliderItem
            key={index}
            exercise={workout.exercise}
            date={workout.date}
            icon={workout.icon}
          />
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;