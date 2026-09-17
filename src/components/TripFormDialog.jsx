import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack, Button, Chip,
} from '@mui/material'
import { emptyTrip, WEATHER_QUICK_OPTIONS } from '../constants/formOptions.js'

export default function TripFormDialog({ open, onClose, initialTrip, onSave }) {
  const [trip, setTrip] = useState(() => initialTrip || emptyTrip())

  useEffect(() => {
    if (open) setTrip(initialTrip || emptyTrip())
  }, [open, initialTrip])

  const set = (field) => (e) => setTrip((t) => ({ ...t, [field]: e.target.value }))
  const isValid = trip.title.trim().length > 0

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialTrip ? 'ویرایش برنامه' : 'برنامه‌ی قارچ‌نگری جدید'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.2} sx={{ mt: 0.5 }}>
          <TextField
            label="نام گروه / تور"
            value={trip.title}
            onChange={set('title')}
            autoFocus
            placeholder="مثلاً: تور مکاشفه پشت‌پرده هیرکانی"
          />
          <TextField
            label="تاریخ سفر"
            type="date"
            value={trip.date}
            onChange={set('date')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="منطقه / مسیر"
            value={trip.region}
            onChange={set('region')}
            placeholder="مثلاً: جنگل‌های هیرکانی، رودبار"
          />
          <TextField
            label="نام ثبت‌کننده"
            value={trip.registrant}
            onChange={set('registrant')}
          />
          <TextField
            label="همراهان"
            value={trip.companions}
            onChange={set('companions')}
            multiline
            minRows={1}
          />
          <TextField
            label="شرایط آب‌وهوایی"
            value={trip.weather}
            onChange={set('weather')}
          />
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
            {WEATHER_QUICK_OPTIONS.map((w) => (
              <Chip
                key={w}
                label={w}
                size="small"
                variant={trip.weather === w ? 'filled' : 'outlined'}
                color={trip.weather === w ? 'primary' : 'default'}
                onClick={() => setTrip((t) => ({ ...t, weather: w }))}
              />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">انصراف</Button>
        <Button
          onClick={() => onSave(trip)}
          variant="contained"
          disabled={!isValid}
        >
          ذخیره
        </Button>
      </DialogActions>
    </Dialog>
  )
}
