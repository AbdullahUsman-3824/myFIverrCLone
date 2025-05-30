function JoinFiverr() {
  return (
    <div className="mx-32 my-16 relative">
      <div className="absolute z-10 top-1/3 left-10">
        <h4 className="text-white text-5xl mb-10">
          Suddenly it&apos;s all so <i>doable.</i>
        </h4>
        <button
          className="border text-base font-medium px-5 py-2   border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
          type="button"
        >
          Join Fiverr
        </button>
      </div>
      <div className="w-full h-96 relative">
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