export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="animate-bounce">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="size-10 md:size-12 drop-shadow-[0_0_10px_#4ade80] hover:scale-110 transition"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text animate-pulse">
        HousePlan<span className="text-white">.AI</span>
      </h1>
    </div>
  );
}
