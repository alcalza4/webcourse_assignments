import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../context/NotificationContext'


export const useLikeBlog = () => {
  const queryClient = useQueryClient()
  const [, notify] = useNotification()

  return useMutation({
    mutationFn: blogService.updateBlog,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`blog ${updatedBlog.title} has been liked`, 'success')
    },
    onError: (error) => {
      notify(`error liking blog: ${error.message}`, 'error')
    }
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()
  const [, notify] = useNotification()

  return useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (_, deletedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`blog ${deletedBlog.title} been deleted`, 'success')
    },
    onError: (error) => {
      notify(`error deleting blog: ${error.message}`, 'error')
    }
  })
}