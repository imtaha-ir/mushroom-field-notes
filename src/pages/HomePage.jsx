import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Container, Stack, Fab, Menu, MenuItem,
  Box, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import TripCard from '../components/TripCard.jsx'
import TripFormDialog from '../components/TripFormDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getAllTrips, saveTrip, deleteTrip, countSamples, genId } from '../db.js'
import { shareTrip } from '../utils/export.js'

export default function HomePage() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [menu, setMenu] = useState({ anchor: null, trip: null })
  const [sharingId, setSharingId] = useState(null)

  const load = async () => {
    setLoading(true)
    const all = await getAllTrips()
    setTrips(all)
    const entries = await Promise.all(all.map(async (t) => [t.id, await countSamples(t.id)]))
    setCounts(Object.fromEntries(entries))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNewDialog = () => { setEditingTrip(null); setDialogOpen(true) }
  const openEditDialog = (trip) => { setEditingTrip(trip); setDialogOpen(true); setMenu({ anchor: null, trip: null }) }

  const handleSave = async (trip) => {
    const toSave = trip.id ? trip : { ...trip, id: genId() }
    await saveTrip(toSave)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async (trip) => {
    setMenu({ anchor: null, trip: null })
    if (window.confirm(`برنامه‌ی «${trip.title}» و همه‌ی نمونه‌های آن حذف شود؟`)) {
      await deleteTrip(trip.id)
      load()
    }
  }

  const handleShare = async (trip) => {
    setMenu({ anchor: null, trip: null })
    setSharingId(trip.id)
    try {
      const result = await shareTrip(trip)
      if (result === 'downloaded') {
        window.alert('اشتراک‌گذاری مستقیم در این مرورگر پشتیبانی نمی‌شود؛ فایل زیپ دانلود شد.')
      }
    } catch (err) {
      window.alert('ساخت فایل اشتراک‌گذاری با خطا مواجه شد.')
    } finally {
      setSharingId(null)
    }
  }

  return (
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <ForestOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
          <Typography variant="h6" component="h1">یادداشت‌های میدانی قارچ</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 2.5 }}>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress size={28} /></Stack>
        ) : trips.length === 0 ? (
          <EmptyState
            icon={<ForestOutlinedIcon fontSize="inherit" />}
            title="هنوز برنامه‌ای ثبت نشده"
            description="با دکمه‌ی + یک برنامه‌ی قارچ‌نگری جدید بسازید و نمونه‌ها را در آن ثبت کنید."
          />
        ) : (
          <Stack spacing={1.5}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                sampleCount={counts[trip.id] ?? 0}
                onClick={() => navigate(`/trip/${trip.id}`)}
                onMenuClick={(e) => setMenu({ anchor: e.currentTarget, trip })}
                sharing={sharingId === trip.id}
              />
            ))}
          </Stack>
        )}
      </Container>

      <Fab
        color="secondary"
        onClick={openNewDialog}
        sx={{ position: 'fixed', bottom: 24, left: 24 }}
        aria-label="برنامه جدید"
      >
        <AddIcon />
      </Fab>

      <Menu anchorEl={menu.anchor} open={Boolean(menu.anchor)} onClose={() => setMenu({ anchor: null, trip: null })}>
        <MenuItem onClick={() => openEditDialog(menu.trip)}>
          <EditOutlinedIcon fontSize="small" sx={{ ml: 1 }} /> ویرایش
        </MenuItem>
        <MenuItem onClick={() => handleShare(menu.trip)}>
          <ShareOutlinedIcon fontSize="small" sx={{ ml: 1 }} /> اشتراک‌گذاری (فایل زیپ)
        </MenuItem>
        <MenuItem onClick={() => handleDelete(menu.trip)} sx={{ color: 'error.main' }}>
          <DeleteOutlineIcon fontSize="small" sx={{ ml: 1 }} /> حذف
        </MenuItem>
      </Menu>

      <TripFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialTrip={editingTrip}
        onSave={handleSave}
      />
    </Box>
  )
}
