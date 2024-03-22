import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  loadTests: { [key: number]: LoadTestModel };
  loadTestsTests: { [key: number]: LoadTestTestsModel };
  testMetrics: { [key: number]: { [innerKey: number]: ResponseFragment[] } };
}

const initialState: InitialState = {
  loadTests: {},
  loadTestsTests: {},
  testMetrics: {},
};

const loadtestSlice = createSlice({
  name: 'loadtest',
  initialState,
  reducers: {
    addLoadTest: (state, action: PayloadAction<LoadTestModel>) => {
      const test = action.payload;
      state.loadTests[test.id] = test;
    },
    addLoadTestsTest: (state, action: PayloadAction<LoadTestTestsModel>) => {
      const data = action.payload;
      state.loadTestsTests[data.id] = data;
    },
    addTestMetrics: (state, action: PayloadAction<{ id: number, data: Map<number, ResponseFragment[]> }>) => {
      const { id, data } = action.payload;
      state.testMetrics[id] = { ...state.testMetrics[id], ...data };
    }
  },
});

export const { addLoadTest, addLoadTestsTest, addTestMetrics } = loadtestSlice.actions;
export default loadtestSlice.reducer;
