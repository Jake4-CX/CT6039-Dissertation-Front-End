import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/utils/testUtils.tsx';
import TestsTableComponent from './testHistory';
import MockDate from 'mockdate';

describe('TestsTableComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    MockDate.set(new Date('2024-01-01T00:01:00Z'));

  });

  it('renders without data', async () => {
    render(<TestsTableComponent loadTests={undefined} />);
    expect(screen.getByText(/No tests found/i)).toBeInTheDocument();
  });

  it('renders with mock data', async () => {
    const mockData: ViewLoadTestModal = {
      test: {
        id: 1,
        uuid: "eaa3104a-4200-4055-8cfd-0cc01b9e9dec",
        name: "Test 1",
        testPlan: {
          id: 1,
          loadTestModelId: 1,
          reactFlowPlan: "{}",
          testPlan: "{}",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          deletedAt: null
        },
        loadTests: [
          {
            id: 1,
            loadTestModelId: 1,
            duration: 1000,
            virtualUsers: 100,
            state: "COMPLETED",
            loadTestType: "LOAD",
            testMetrics: {
              id: 1,
              loadTestTestsModelId: 1,
              totalRequests: 100,
              successfulRequests: 90,
              failedRequests: 10,
              totalResponseTime: 10000,
              averageResponseTime: 100,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
              deletedAt: null
            },
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            deletedAt: null
          }
        ],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        deletedAt: null
      },
      testMetrics: new Map()
    };

    render(<TestsTableComponent loadTests={mockData} />);
    await waitFor(() => {
      expect(screen.getByText(mockData.test.loadTests[0].loadTestType.toLowerCase())).toBeInTheDocument();
      expect(screen.getByText("a minute ago")).toBeInTheDocument();
      expect(screen.getByText("completed")).toBeInTheDocument();
    });
  });
});
