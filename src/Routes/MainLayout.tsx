import { Outlet } from "react-router";
import Navbar from "../UI/Navbar";
import { useBudgetContext } from "../provide/budget";

export default function MainLayout() {
  const { isLoading } = useBudgetContext();
  return (
    <div className="w-110 sm:w-180 h-182     fixed top-0     ">
      {isLoading && <div className="bg-black/80 w-full h-191 absolute top-0 z-20 flex justify-center items-center">
        <div className="size-20 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    
     </div>}

   
      <div className="relative z-10">
        <Outlet />
     </div>
    
      <div className="text-6xl  absolute bottom-2 z-10 flex justify-center  w-full ">
        <div className="w-110 sm:w-180 h-23.75   backdrop-blur-[3px]    absolute top-9 rounded-b-4xl" ></div>
         <Navbar />
    </div>
  
  

    </div>
  );
}