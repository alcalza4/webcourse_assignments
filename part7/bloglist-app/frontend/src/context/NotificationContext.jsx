import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return { message: null, type: null }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: null,
    type: null,
  })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const [notification, dispatch] = useContext(NotificationContext)

  const notifyWithTimeout = (message, type) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return [notification, notifyWithTimeout]
}

export default NotificationContext
