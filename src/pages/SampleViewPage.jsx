import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Container, Stack, Typography, IconButton, Card, CircularProgress,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined'
import BlurCircularOutlinedIcon from '@mui/icons-material/BlurCircularOutlined'
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined'
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined'
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined'

import PhotoPager from '../components/PhotoPager.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getSample } from '../db.js'

function formatList(values, otherValue) {
  if (!values || values.length === 0) return ''
  return values.map((v) => (v === 'سایر' && otherValue ? `سایر (${otherValue})` : v)).join('، ')
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 128, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>{value}</Typography>
    </Stack>
  )
}

function InfoSection({ icon, title, rows }) {
  const visibleRows = rows.filter((r) => r.value)
  if (visibleRows.length === 0) return null
  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
      <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
        {visibleRows.map((r, i) => <InfoRow key={i} label={r.label} value={r.value} />)}
      </Stack>
    </Card>
  )
}

export default function SampleViewPage() {
  const { tripId, sampleId } = useParams()
  const navigate = useNavigate()
  const [sample, setSample] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setSample(await getSample(sampleId))
      setLoading(false)
    })()
  }, [sampleId])

  if (loading) {
    return <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress size={28} /></Stack>
  }

  if (!sample) {
    return (
      <EmptyState
        icon={<EmojiNatureOutlinedIcon fontSize="inherit" />}
        title="این نمونه پیدا نشد"
        description="ممکن است حذف شده باشد."
      />
    )
  }

  const locationRows = [
    { label: 'محل مشاهده', value: sample.location },
    { label: 'زیستگاه', value: formatList(sample.habitat, sample.habitatOther) },
    { label: 'بستر رویش', value: formatList(sample.substrate, sample.substrateOther) },
    { label: 'نحوه رویش', value: formatList(sample.growthPattern) },
  ]

  const capRows = [
    { label: 'شکل', value: formatList(sample.cap?.shape, sample.cap?.shapeOther) },
    { label: 'سطح', value: formatList(sample.cap?.surface, sample.cap?.surfaceOther) },
    { label: 'حاشیه', value: formatList(sample.cap?.margin) },
    { label: 'رنگ کلاهک', value: sample.cap?.color },
    { label: 'تغییر رنگ', value: sample.cap?.colorChange },
  ]

  const hymenophoreRows = [
    { label: 'شکل', value: formatList(sample.hymenophore?.shape) },
    { label: 'رنگ زیر کلاهک', value: sample.hymenophore?.underColor },
  ]

  const stipeRows = [
    { label: 'دارد / ندارد', value: sample.stipe?.present },
    { label: 'شکل', value: formatList(sample.stipe?.shape, sample.stipe?.shapeOther) },
    { label: 'توپر / توخالی', value: sample.stipe?.texture },
    { label: 'حلقه (Ring)', value: sample.stipe?.ring },
    { label: 'ولوا (Volva)', value: sample.stipe?.volva },
    { label: 'رنگ پایه', value: sample.stipe?.color },
  ]

  const fleshRows = [
    { label: 'بافت', value: formatList(sample.flesh?.texture, sample.flesh?.textureOther) },
    { label: 'رنگ گوشت', value: sample.flesh?.color },
    { label: 'تغییر رنگ (لمس/فشار)', value: sample.flesh?.touchChange },
    { label: 'تغییر رنگ (برش)', value: sample.flesh?.cutChange },
  ]

  const otherRows = [
    { label: 'شیره یا لاتکس', value: sample.latex },
    { label: 'بو', value: sample.smell },
    { label: 'رنگ اسپورپرینت', value: sample.sporePrintNotPrepared ? 'تهیه نشد' : sample.sporePrintColor },
  ]

  return (
    <Box sx={{ pb: 6, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'relative' }}>
        <PhotoPager photos={sample.photos} />

        <IconButton
          onClick={() => navigate(`/trip/${tripId}`)}
          sx={{
            position: 'absolute', top: 12, right: 12,
            bgcolor: 'rgba(0,0,0,0.45)', color: '#fff',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>

        <IconButton
          onClick={() => navigate(`/trip/${tripId}/sample/${sampleId}`)}
          sx={{
            position: 'absolute', top: 12, left: 12,
            bgcolor: 'rgba(0,0,0,0.45)', color: '#fff',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
          }}
        >
          <EditOutlinedIcon />
        </IconButton>
      </Box>

      <Container maxWidth="sm" sx={{ pt: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          نمونه {sample.order} {sample.location ? `— ${sample.location}` : ''}
        </Typography>

        <Stack spacing={1.5}>
          <InfoSection icon={<TerrainOutlinedIcon color="primary" />} title="محل مشاهده و محیط رویش" rows={locationRows} />
          <InfoSection icon={<BlurCircularOutlinedIcon color="primary" />} title="کلاهک (Cap)" rows={capRows} />
          <InfoSection icon={<ViewStreamOutlinedIcon color="primary" />} title="سطح زیر کلاهک (Hymenophore)" rows={hymenophoreRows} />
          <InfoSection icon={<HeightOutlinedIcon color="primary" />} title="پایه (Stipe)" rows={stipeRows} />
          <InfoSection icon={<TextureOutlinedIcon color="primary" />} title="گوشت قارچ" rows={fleshRows} />
          <InfoSection icon={<ScienceOutlinedIcon color="primary" />} title="شیره، بو و اسپورپرینت" rows={otherRows} />
          {sample.notes && (
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1 }}>
                <StickyNote2OutlinedIcon color="primary" />
                <Typography variant="subtitle1">یادداشت‌های تکمیلی</Typography>
              </Stack>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{sample.notes}</Typography>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
