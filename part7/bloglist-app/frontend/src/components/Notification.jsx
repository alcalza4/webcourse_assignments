import { Alert } from 'react-bootstrap'

import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'

const Notification = () => {
  const [notification, dispatch] = useContext(NotificationContext)

  if (!notification || notification.message === null) {
    return null
  }

  const variant = notification.type === 'error' ? 'danger' : 'success'

  return (
    <Alert variant={variant} className="mt-3">
      {notification.message}
    </Alert>
  )
}

export default Notification
