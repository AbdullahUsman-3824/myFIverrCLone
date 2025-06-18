function JoinFiverr() {
  return (
    <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-32 my-8 sm:my-12 md:my-16 relative">
      <div className="absolute z-10 top-1/4 sm:top-1/3 left-4 sm:left-6 md:left-8 lg:left-10 right-4 sm:right-6 md:right-8 lg:right-auto">
        <h4 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 md:mb-10 leading-tight">
          Suddenly it&apos;s all so <i>doable.</i>
        </h4>
        <button
          className="border text-sm sm:text-base font-medium px-4 sm:px-5 py-2 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md hover:bg-[#19a866] transition-colors duration-300"
          type="button"
        >
          Join Fiverr
        </button>
      </div>
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative">
        <img 
          src="/bg-signup.webp" 
          alt="signup" 
          className="w-full h-full object-cover rounded-sm"
        />
      </div>
    </div>
  );
}

export default JoinFiverr;