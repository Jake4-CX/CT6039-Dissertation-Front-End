import { cleanup, render, RenderOptions } from '@testing-library/react';
import { afterEach } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AppStore, RootState, setupStore } from '@/redux/store';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';

afterEach(() => {
  cleanup();
});

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

const customRender = (ui: React.ReactElement, extendedRenderOptions: ExtendedRenderOptions = {}) => {

  const { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  )

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            {ui}
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>,
      { wrapper: Wrapper, ...renderOptions },
    )
  }
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };