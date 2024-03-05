import ReactDOM from 'react-dom/client'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { ReduxProvider } from './redux/provider';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './views/landing';
import ViewLoadTestPage from './views/tests/viewTest';
import EditLoadTestPage from './views/tests/editTest';
import { ThemeProvider } from './components/themeProvider';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<LandingPage />} />

      {/* View Test */}
      <Route path="/test/:loadTestId" element={<ViewLoadTestPage />} />
      <Route path="/test/:loadTestId/edit" element={<EditLoadTestPage />} />
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
      {/* </AppInitializer> */}
      <Toaster position='top-right' />
    </QueryClientProvider>
  </ReduxProvider>,
)
