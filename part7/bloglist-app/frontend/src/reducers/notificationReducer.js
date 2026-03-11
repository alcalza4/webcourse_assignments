import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, type: null },
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return { message: null, type: null }
    }
  }
})

const { setNotification, clearNotification } = notificationSlice.actions

export const sendNotification = (message, type) => {
  return async (dispatch) => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer