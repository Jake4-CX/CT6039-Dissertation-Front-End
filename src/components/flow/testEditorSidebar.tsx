import { Network, Octagon, Play, Timer, Workflow } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

const TestEditorSidebarComponent: React.FC = () => {

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <>
      <Card className="w-full md:w-fit">

        <CardHeader className="p-3 min-w-[12rem]">
          <div className="flex items-center space-x-3">
            <Workflow className="h-6 w-6 text-gray-500" />
            <div className="flex flex-col">
              <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Nodes</h3>
              <p className="text-muted-foreground text-sm font-normal">Subheading here</p>
            </div>
          </div>
        </CardHeader>
        <ScrollArea className="h-[24rem]">
          <CardContent className="px-3">
            {/* Section containing start/stop */}
            <h2 className="whitespace-nowrap tracking-tight text-sm font-medium mb-1">Start/Stop</h2>
            <div className="flex flex-col w-full space-y-3">
              <div
                className="w-full h-[2rem] bg-background border-green-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'startNode')}
              >
                <span className="h-full w-[2rem] bg-green-500 rounded-l-sm flex items-center justify-center">
                  <Play className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">START</p>
              </div>
              <div
                className="w-full h-[2rem] bg-background border-red-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'stopNode')}
              >
                <span className="h-full w-[2rem] bg-red-500 rounded-l-sm flex items-center justify-center">
                  <Octagon className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">STOP</p>
              </div>
            </div>

            {/* Requests section */}
            <h2 className="whitespace-nowrap tracking-tight text-sm font-medium mb-1">Requests</h2>
            <div className="flex flex-col w-full space-y-3">
              <div
                className="w-full h-[2rem] bg-background border-green-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'getRequest')}
              >
                <span className="h-full w-[2rem] bg-green-500 rounded-l-sm flex items-center justify-center">
                  <Workflow className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">GET</p>
              </div>

              <div
                className="w-full h-[2rem] bg-background border-amber-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'postRequest')}
              >
                <span className="h-full w-[2rem] bg-amber-500 rounded-l-sm flex items-center justify-center">
                  <Workflow className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">POST</p>
              </div>

              <div
                className="w-full h-[2rem] bg-background border-blue-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'putRequest')}
              >
                <span className="h-full w-[2rem] bg-blue-500 rounded-l-sm flex items-center justify-center">
                  <Workflow className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">PUT</p>
              </div>

              <div
                className="w-full h-[2rem] bg-background border-red-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'deleteRequest')}
              >
                <span className="h-full w-[2rem] bg-red-500 rounded-l-sm flex items-center justify-center">
                  <Workflow className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">DELETE</p>
              </div>
            </div>

            {/* Conditional section */}
            <h2 className="whitespace-nowrap tracking-tight text-sm font-medium mt-3 mb-1">Conditionals</h2>
            <div className="flex flex-col w-full space-y-3">
              <div
                className="w-full h-[2rem] bg-background border-blue-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'ifCondition')}
              >
                <span className="h-full w-[2rem] bg-blue-500 rounded-l-sm flex items-center justify-center">
                  <Network className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">IF</p>
              </div>
            </div>

            {/* Logic Flow section */}
            <h2 className="whitespace-nowrap tracking-tight text-sm font-medium mt-3 mb-1">Logic Flows</h2>
            <div className="flex flex-col w-full space-y-3">
              <div
                className="w-full h-[2rem] bg-background border-gray-500 border rounded-md flex items-center shadow-md cursor-pointer space-x-3"
                draggable
                onDragStart={(event) => onDragStart(event, 'delayNode')}
              >
                <span className="h-full w-[2rem] bg-gray-500 rounded-l-sm flex items-center justify-center">
                  <Timer className="h-4 w-4 text-muted" />
                </span>
                <p className="text-base font-semibold text-foreground">DELAY</p>
              </div>
            </div>
          </CardContent>
        </ScrollArea>

      </Card>
    </>
  )

}

export default TestEditorSidebarComponent;