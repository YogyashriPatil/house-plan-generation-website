import { Footer } from "./Footer";

export function Logo(){
    return <div>
        <div className="flex justify-center p-5">
            <div className="md: animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 md:size-10 animate-pulse transition-all delay-300">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </div>
            <h1 className="text-2xl md:text-4xl animate-pulse transition-all delay-300 text-shadow-slate-200 pl-3">HousePlan.AI</h1>
        </div>
    </div>
}