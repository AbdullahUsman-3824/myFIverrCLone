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
    <div className="mx-20 my-16">
      <h2 className="text-4xl mb-5 text-[#404145] font-bold">
        Popular Services
      </h2>
      <ul className="flex flex-wrap gap-16">
        {popularServicesData.map(({ name, label, image, categoryId }) => {
          return (
            <li
              key={name}
              className="relative cursor-pointer"
              onClick={() => navigate(`/category/${categoryId}`)}
            >
              <div className="absolute z-10 text-white left-5 top-4">
                <span>{label}</span>
                <h6 className="font-extrabold text-2xl">{name}</h6>
              </div>
              <div className="h-80 w-72 relative">
                <img 
                  src={image} 
                  alt="service" 
                  className="w-full h-full object-cover"
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