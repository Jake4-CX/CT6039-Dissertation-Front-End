import NavbarComponent from "@/components/global/navbar";
import SidebarComponent from "@/components/global/sidebar";

type DefaultLayoutProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, className }) => {

  return (
    <>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <SidebarComponent />
        <div className="flex flex-col w-full">
          <NavbarComponent />
          <div className="flex w-full items-center justify-center">
            <main className={`flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 xl:max-w-[1280px] ${className}`}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default DefaultLayout;