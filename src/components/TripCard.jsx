import { Card, CardActionArea, Box, Typography, Stack, Chip, IconButton, CircularProgress } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function TripCard({ trip, sampleCount, onClick, onMenuClick, sharing = false }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardActionArea onClick={onClick} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" noWrap>{trip.title}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 0.75, color: 'text.secondary' }} flexWrap="wrap">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <EventOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{formatDate(trip.date)}</Typography>
              </Stack>
              {trip.region && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" noWrap>{trip.region}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>
          {sharing ? (
            <CircularProgress size={20} sx={{ mt: 0.5, mr: 0.5 }} />
          ) : (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onMenuClick(e) }}
              sx={{ mt: -0.5, mr: -0.5 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="center">
          <Chip
            size="small"
            icon={<PhotoLibraryOutlinedIcon sx={{ fontSize: 16 }} />}
            label={`${sampleCount} نمونه`}
            variant="outlined"
          />
        </Stack>
      </CardActionArea>
    </Card>
  )
}
