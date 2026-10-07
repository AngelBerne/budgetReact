

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <div className="w-110 sm:w-180 h-200  bg-(--color-mybgColor) fixed     rounded-b-4xl ">
      <div className="relative z-0 ">
        {children}
        </div>
     
    </div>
  );
}