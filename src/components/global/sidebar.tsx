// import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { TbActivity, TbPackage } from "react-icons/tb";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ThemeToggleComponent from "./themeToggle";

const SidebarComponent: React.FC = () => {

  return (
    <>
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to="/">
              <TbPackage className="h-6 w-6" />
              <span className="">Product Name</span>
            </Link>
            {/* <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <TbBell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
            <ThemeToggleComponent />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                to="/"
              >
                <TbActivity className="h-4 w-4" />
                Test Plans
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                to="/workers"
              >
                <TbPackage className="h-4 w-4" />
                Connected Workers
              </Link>
            </nav>
          </div>
          {/* <div className="mt-auto p-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock all features and get unlimited access to our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </>
  )

}

export default SidebarComponent;