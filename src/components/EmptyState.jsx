import { Box, Typography } from '@mui/material'

export default function EmptyState({ icon, title, description }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: 'text.secondary',
        px: 4,
        py: 8,
      }}
    >
      <Box sx={{ fontSize: 56, mb: 2, opacity: 0.6, color: 'primary.main' }}>{icon}</Box>
      <Typography variant="subtitle1" color="text.primary" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  )
}
