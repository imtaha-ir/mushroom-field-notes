import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AppBar, Toolbar, IconButton, Typography, Container, Stack, Fab,
  Box, CircularProgress, Chip, Menu, MenuItem, Button,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddIcon from '@mui/icons-material/Add'
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SampleCard from '../components/SampleCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TripFormDialog from '../components/TripFormDialog.jsx'
import { getTrip, getSamplesByTrip, deleteSample, saveTrip } from '../db.js'
import { buildTripZip, shareOrDownloadZip } from '../utils/export.js'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function TripPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [pageMenu, setPageMenu] = useState(null)
  const [sampleMenu, setSampleMenu] = useState({ anchor: null, sample: null })
  const [sharing, setSharing] = useState(false)

  const load = async () => {
    setLoading(true)
    const [t, s] = await Promise.all([getTrip(tripId), getSamplesByTrip(tripId)])
    setTrip(t)
    setSamples(s)
    setLoading(false)
  }

  useEffect(() => { load() }, [tripId])

  const handleDeleteSample = async (sample) => {
    setSampleMenu({ anchor: null, sample: null })
    if (window.confirm(`نمونه ${sample.order} حذف شود؟`)) {
      await deleteSample(sample.id)
      load()
    }
  }

  const handleSaveTrip = async (updated) => {
    await saveTrip(updated)
    setEditOpen(false)
    load()
  }

  const handleShare = async () => {
    setPageMenu(null)
    setSharing(true)
    try {
      const blob = await buildTripZip(trip, samples)
      const filename = `${trip.title || 'برنامه'}${trip.date ? '-' + trip.date : ''}.zip`
      const result = await shareOrDownloadZip(blob, filename)
      if (result === 'downloaded') {
        window.alert('اشتراک‌گذاری مستقیم در این مرورگر پشتیبانی نمی‌شود؛ فایل زیپ دانلود شد.')
      }
    } catch (err) {
      window.alert('ساخت فایل اشتراک‌گذاری با خطا مواجه شد.')
    } finally {
      setSharing(false)
    }
  }

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress size={28} /></Stack>
    )
  }

  if (!trip) {
    return (
      <EmptyState
        icon={<EmojiNatureOutlinedIcon fontSize="inherit" />}
        title="این برنامه پیدا نشد"
        description="ممکن است حذف شده باشد."
      />
    )
  }

  return (
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')} sx={{ ml: 1 }}>
            <ArrowForwardIcon />
          </IconButton>
          <Typography variant="h6" component="h1" noWrap sx={{ flex: 1 }}>{trip.title}</Typography>
          {sharing && <CircularProgress size={20} sx={{ ml: 1.5 }} />}
          <IconButton onClick={(e) => setPageMenu(e.currentTarget)} disabled={sharing}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 2 }}>
        <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mb: 2.5 }}>
          <Chip size="small" icon={<EventOutlinedIcon />} label={formatDate(trip.date)} />
          {trip.region && <Chip size="small" icon={<PlaceOutlinedIcon />} label={trip.region} />}
          {trip.weather && <Chip size="small" icon={<WbCloudyOutlinedIcon />} label={trip.weather} />}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1">نمونه‌های ثبت‌شده ({samples.length})</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/trip/${tripId}/sample/new`)}
          >
            نمونه جدید
          </Button>
        </Stack>

        {samples.length === 0 ? (
          <EmptyState
            icon={<EmojiNatureOutlinedIcon fontSize="inherit" />}
            title="هنوز نمونه‌ای ثبت نشده"
            description="با دکمه‌ی «نمونه جدید» اولین قارچ مشاهده‌شده را ثبت کنید."
          />
        ) : (
          <Stack spacing={1.25}>
            {samples.map((sample) => (
              <SampleCard
                key={sample.id}
                sample={sample}
                onClick={() => navigate(`/trip/${tripId}/sample/${sample.id}/view`)}
                onMenuClick={(e) => setSampleMenu({ anchor: e.currentTarget, sample })}
              />
            ))}
          </Stack>
        )}
      </Container>

      <Fab
        color="secondary"
        onClick={() => navigate(`/trip/${tripId}/sample/new`)}
        sx={{ position: 'fixed', bottom: 24, left: 24 }}
        aria-label="نمونه جدید"
      >
        <AddIcon />
      </Fab>

      <Menu anchorEl={pageMenu} open={Boolean(pageMenu)} onClose={() => setPageMenu(null)}>
        <MenuItem onClick={() => { setEditOpen(true); setPageMenu(null) }}>
          <EditOutlinedIcon fontSize="small" sx={{ ml: 1 }} /> ویرایش اطلاعات برنامه
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ShareOutlinedIcon fontSize="small" sx={{ ml: 1 }} /> اشتراک‌گذاری برنامه (فایل زیپ)
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={sampleMenu.anchor}
        open={Boolean(sampleMenu.anchor)}
        onClose={() => setSampleMenu({ anchor: null, sample: null })}
      >
        <MenuItem
          onClick={() => {
            navigate(`/trip/${tripId}/sample/${sampleMenu.sample.id}`)
            setSampleMenu({ anchor: null, sample: null })
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ ml: 1 }} /> ویرایش نمونه
        </MenuItem>
        <MenuItem onClick={() => handleDeleteSample(sampleMenu.sample)} sx={{ color: 'error.main' }}>
          <DeleteOutlineIcon fontSize="small" sx={{ ml: 1 }} /> حذف نمونه
        </MenuItem>
      </Menu>

      <TripFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialTrip={trip}
        onSave={handleSaveTrip}
      />
    </Box>
  )
}
