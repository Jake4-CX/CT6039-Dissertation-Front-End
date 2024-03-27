import '@testing-library/jest-dom';
import { test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnGoingTestCard from './ongoingTestCard';
import { ReduxProvider } from '@/redux/provider';
import MockDate from 'mockdate';

const activeTest: LoadTestTestsModel = {
  id: 1,
  loadTestModelId: 1,
  duration: 1,
  virtualUsers: 1,
  state: 'RUNNING',
  loadTestType: 'LOAD',
  testMetrics: {
    id: 1,
    loadTestTestsModelId: 1,
    totalRequests: 1,
    successfulRequests: 1,
    failedRequests: 1,
    totalResponseTime: 1,
    averageResponseTime: 1,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date().toString(),
    deletedAt: null,
  } as LoadTestMetricsModel,
  createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date().toString(),
  deletedAt: null,
};

const testProps: LoadTestModel = {
  id: 1,
  uuid: '123',
  name: 'Test Name',
  loadTests: [activeTest],
  testPlan: {
    id: 1,
    loadTestModelId: 1,
    reactFlowPlan: 'Test Plan',
    testPlan: 'Test Plan Details',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    deletedAt: null,
  } as LoadTestPlanModel,
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  deletedAt: null,
};

beforeEach(() => {
  // Set the current date to match the activeTest.createdAt date
  MockDate.set(new Date('2024-01-01T00:01:00Z'));
});

afterEach(() => {
  MockDate.reset();
});

test('renders without crashing', async () => {

  render(
    <ReduxProvider>
      <MemoryRouter>
        <OnGoingTestCard test={testProps} activeTest={activeTest} />
      </MemoryRouter>
    </ReduxProvider>
  );
  expect(screen.getByTestId('ongoingTestCard')).toBeInTheDocument();
});

test('renders test name', async () => {

  render(
    <ReduxProvider>
      <MemoryRouter>
        <OnGoingTestCard test={testProps} activeTest={activeTest} />
      </MemoryRouter>
    </ReduxProvider>
  );
  expect(screen.getByTestId('testNameHeading')).toHaveTextContent('Test');
});

test('displays correct time remaining', async () => {

  render(
    <ReduxProvider>
      <MemoryRouter>
        <OnGoingTestCard test={testProps} activeTest={activeTest} />
      </MemoryRouter>
    </ReduxProvider>
  );

  const timeRemainingDisplay = screen.getByTestId("timeRemaining");
  expect(timeRemainingDisplay).toHaveTextContent('a minute ago');
});