import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'

const Notification = () => {
  const [notification, dispatch] = useContext(NotificationContext)

  if (!notification || notification.message === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification
