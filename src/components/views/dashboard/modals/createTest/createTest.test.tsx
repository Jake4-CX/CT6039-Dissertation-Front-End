import { expect, test, vi } from 'vitest';
import { render, fireEvent, act } from '@/utils/testUtils.tsx';
import CreateTestModal from './createTest.tsx'

import { createTest } from '@/api/tests';

vi.mock('@/api/tests', () => ({
  createTest: vi.fn(() => Promise.resolve({ data: 'Test created' })),
}));

test('CreateTestModal renders without crashing', async () => {
  const { container } = render(<CreateTestModal />, {})
  expect(container).to.exist
})

test('CreateTestModal opens and closes correctly', async () => {
  const { getByRole, queryByRole } = await render(<CreateTestModal />)

  // Expect the dialog to be not open
  expect(queryByRole('dialog')).to.be.null

  // Open the dialog
  const button = getByRole('button', { name: /New test/i })
  fireEvent.click(button)

  // The dialog should be present
  expect(getByRole('dialog')).to.exist

  // Close the dialog
  fireEvent.click(button)

  // The dialog should be closed
  expect(queryByRole('dialog')).to.be.null
})

test('CreateTestModal form submission works', async () => {
  const { getByRole, getByLabelText, getByTestId } = render(<CreateTestModal />);

  // Open the dialog
  await act(async () => {
    fireEvent.click(getByRole('button', { name: /New test/i }));
  });

  // Fill in the form
  await act(async () => {
    fireEvent.change(getByLabelText(/Test Name/), { target: { value: 'Test name' } });
  });

  // Submit the form
  await act(async () => {
    fireEvent.click(getByTestId('submit-test-button'));
  });

  // Ensure the createTest function was called with the correct arguments
  await act(async () => {
    expect(vi.mocked(createTest)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createTest)).toHaveBeenCalledWith({ name: 'Test name' });
  });
});