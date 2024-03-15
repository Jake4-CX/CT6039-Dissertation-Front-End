import { getWorkers } from "@/api/workers";
import WorkerCard from "@/components/views/workers/cards/workerCard";
import DefaultLayout from "@/layouts/defaultLayout";
import { useQuery } from "@tanstack/react-query";

const WorkersPage: React.FC = () => {

  const workers = useQuery({
    queryKey: [`workers`],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const testsResponse = await getWorkers();

      return testsResponse.data as Worker[];
    }
  });

  return (
    <DefaultLayout className="">

      <div className="grid items-start gap-4">
        <div className="flex flex-col">
          <h3 className="whitespace-nowrap tracking-tight text-lg md:text-xl font-semibold">Connected Workers</h3>
          <p className="text-muted-foreground text-sm font-normal">There are currently {workers.data?.length || 0} connected workers</p>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {
            !workers || workers.isLoading ? (
              <div>Loading...</div>
            ) : (
              workers.data ? (
                workers.data.length === 0 ? (
                  <div>No workers found</div>
                ) : (
                  workers.data.map((worker, index) => (
                    <WorkerCard key={index} worker={worker} />
                  ))
                )
              ) : (
                <div>Failed to load workers</div>
              )
            )

          }
        </div>
      </div>

    </DefaultLayout>
  )

}

export default WorkersPage;