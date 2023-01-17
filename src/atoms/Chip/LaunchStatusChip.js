import { Chip } from '@mui/material'

const LaunchStatusChip = ({ status }) => {
  const { upcoming, success } = status || {}
  const statusText = upcoming ? 'upcoming' : success ? 'success' : 'failed'
  const chipPropInfo = (() => {
    switch (statusText) {
      case 'upcoming':
        return { color: 'info', label: 'Upcoming' }
      case 'success':
        return { color: 'success', label: 'Success' }
      case 'failed':
        return { color: 'error', label: 'Failed' }

      default:
        break
    }
  })()

  return (
    <Chip
      label={chipPropInfo.label}
      color={chipPropInfo.color}
      sx={{
        fontWeight: 'bold',
        py: 0.5,
        px: 0.5,
        height: 'auto',
      }}
    />
  )
}

export default LaunchStatusChip
