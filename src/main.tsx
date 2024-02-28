import ReactDOM from 'react-dom/client'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { ReduxProvider } from './redux/provider';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './views/landing';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<LandingPage />} />
    </Route>
  )
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      cacheTime: 10_000,
      refetchOnWindowFocus: false,
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <QueryClientProvider client={queryClient}>
      {/* <AppInitializer> */}
      <RouterProvider router={router} />
      {/* </AppInitializer> */}
      <Toaster position='top-right' />
    </QueryClientProvider>
  </ReduxProvider>,
)
