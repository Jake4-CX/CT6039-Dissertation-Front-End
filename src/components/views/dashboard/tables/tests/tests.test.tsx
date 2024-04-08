import { expect, test, vi, describe, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/utils/testUtils.tsx';
import TestsTableComponent from './tests.tsx';
import { setupStore } from '@/redux/store';
import userEvent from '@testing-library/user-event';
import { deleteTest } from "@/api/tests";
import { Store } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

vi.mock('@/api/tests', () => ({
  deleteTest: vi.fn(() => Promise.resolve()),
}));

vi.mock('react-hot-toast', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toast: any = vi.fn();
  toast.success = vi.fn();
  return {
    default: toast,
    ...vi.importActual('react-hot-toast'),
  };
});

const testPlan: LoadTestPlanModel = {
  id: 1,
  loadTestModelId: 1,
  reactFlowPlan: '{}',
  testPlan: '{}',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  deletedAt: null,
}

const loadTest1: LoadTestModel = {
  id: 1,
  name: 'Test 1',
  uuid: 'eaa3104a-4200-4055-8cfd-0cc01b9e9dec',
  testPlan: testPlan,
  loadTests: [],
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  deletedAt: null,
}

const loadTest2: LoadTestModel = {
  id: 2,
  name: 'Test 2',
  uuid: '80fd5640-6c6d-4410-b61f-efbc44c4a4ee',
  testPlan: testPlan,
  loadTests: [],
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  deletedAt: null,
}

describe('TestsTableComponent', () => {
  let store: Store | undefined = undefined;

  beforeEach(() => {
    vi.resetAllMocks();

    store = setupStore({
      loadtestReduser: {
        loadTests: {
          1: loadTest1,
          2: loadTest2
        },
        loadTestsTests: {},
        testMetrics: {}
      },
    });

    console.log(store);
  });

  test('renders tests table with data', async () => {
    render(
      <TestsTableComponent />,
      { store }
    );

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
      expect(screen.getByText('Test 2')).toBeInTheDocument();
    }, { interval: 5000 });

  });

  test('renders no data message', async () => {
    store = setupStore({
      loadtestReduser: {
        loadTests: {},
        loadTestsTests: {},
        testMetrics: {}
      },
    });

    render(
      <TestsTableComponent />,
      { store }
    );

    expect(screen.getByText('No tests found')).toBeInTheDocument();
  });

  test('delete a test successfully', async () => {
    const user = userEvent.setup();

    render(
      <TestsTableComponent />,
      { store }
    );

    // Open Modal
    await user.click(screen.getByTestId(`delete-test-trigger-${loadTest1.uuid}`));

    // Confirm delete
    await user.click(screen.getByTestId(`delete-test-action-${loadTest1.uuid}`));


    expect(deleteTest).toHaveBeenCalledWith(loadTest1.uuid);

    // wait for asynchronous updates
    await waitFor(() => {
      expect(vi.mocked(toast).success).toHaveBeenCalledWith("Test deleted");
    });
  });
});
