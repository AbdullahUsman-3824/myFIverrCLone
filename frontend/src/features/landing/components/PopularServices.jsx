import { useNavigate } from "react-router-dom";

function PopularServices() {
  const navigate = useNavigate();
  const popularServicesData = [
    { 
      name: "Ai Artists", 
      label: "Add talent to AI", 
      image: "/service1.png",
      categoryId: "ai-artists-1"
    },
    { 
      name: "Logo Design", 
      label: "Build your brand", 
      image: "/service2.jpeg",
      categoryId: "logo-design-1"
    },
    {
      name: "Wordpress",
      label: "Customize your site",
      image: "/service3.jpeg",
      categoryId: "wordpress-1"
    },
    {
      name: "Voice Over",
      label: "Share your message",
      image: "/service4.jpeg",
      categoryId: "voice-over-1"
    },
    {
      name: "Social Media",
      label: "Reach more customers",
      image: "/service5.jpeg",
      categoryId: "social-media-1"
    },
    { 
      name: "SEO", 
      label: "Unlock growth online", 
      image: "/service6.jpeg",
      categoryId: "seo-1"
    },
    {
      name: "Illustration",
      label: "Color your dreams",
      image: "/service7.jpeg",
      categoryId: "illustration-1"
    },
    { 
      name: "Translation", 
      label: "Go global", 
      image: "/service8.jpeg",
      categoryId: "translation-1"
    },
  ];
  return (
    <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-8 sm:my-12 md:my-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 text-[#404145] font-bold px-4 sm:px-0">
        Popular Services
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-16">
        {popularServicesData.map(({ name, label, image, categoryId }) => {
          return (
            <li
              key={name}
              className="relative cursor-pointer group"
              onClick={() => navigate(`/category/${categoryId}`)}
            >
              <div className="absolute z-10 text-white left-3 sm:left-4 md:left-5 top-3 sm:top-4">
                <span className="text-xs sm:text-sm md:text-base">{label}</span>
                <h6 className="font-extrabold text-lg sm:text-xl md:text-2xl">{name}</h6>
              </div>
              <div className="h-48 sm:h-56 md:h-64 lg:h-80 w-full relative overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt="service" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PopularServices;