import { useRef, useState } from 'react'
import { Box, IconButton, Chip, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined'

const SWIPE_THRESHOLD = 45

/**
 * گالری تمام‌صفحه‌ی عکس‌های یک نمونه، با ورق‌خوردن از طریق سوآیپ چپ/راست
 * (و دکمه‌های فلش برای دستگاه‌های غیرلمسی).
 *
 * توجه: به‌جای چیدن همه‌ی عکس‌ها در یک ردیف و جابه‌جایی با translateX درصدی
 * (که در برخی مرورگرها/اندازه‌ها به‌درستی محاسبه نمی‌شد)، همیشه فقط عکسِ فعلی
 * رندر می‌شود؛ این روش ساده‌تر و قابل‌اطمینان‌تر است.
 */
export default function PhotoPager({ photos, height = '100dvh' }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(null)

  const count = photos?.length || 0
  const hasPhotos = count > 0
  const safeIndex = hasPhotos ? Math.min(index, count - 1) : 0
  const current = hasPhotos ? photos[safeIndex] : null

  const goTo = (next) => {
    if (!hasPhotos) return
    setIndex((next + count) % count)
  }
  const goNext = () => goTo(safeIndex + 1)
  const goPrev = () => goTo(safeIndex - 1)

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX <= -SWIPE_THRESHOLD) goNext()
    else if (deltaX >= SWIPE_THRESHOLD) goPrev()
    touchStartX.current = null
  }

  if (!hasPhotos) {
    return (
      <Box
        sx={{
          height,
          maxHeight: '80vh',
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <ImageNotSupportedOutlinedIcon sx={{ fontSize: 48, opacity: 0.7 }} />
        <Typography variant="body2" sx={{ opacity: 0.85 }}>برای این نمونه عکسی ثبت نشده است</Typography>
      </Box>
    )
  }

  return (
    <Box
      dir="ltr"
      sx={{
        position: 'relative',
        height,
        maxHeight: '85vh',
        overflow: 'hidden',
        bgcolor: '#000',
        touchAction: 'pan-y',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Box
        key={current.id}
        component="img"
        src={current.dataUrl}
        alt={current.tag || 'عکس نمونه'}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          animation: 'photoFadeIn 0.22s ease',
          '@keyframes photoFadeIn': {
            from: { opacity: 0.35 },
            to: { opacity: 1 },
          },
        }}
      />

      {current.tag && (
        <Chip
          size="small"
          icon={<LabelOutlinedIcon sx={{ fontSize: 15 }} />}
          label={current.tag}
          sx={{
            position: 'absolute', bottom: 14, left: 12,
            bgcolor: 'rgba(255,255,255,0.92)',
          }}
        />
      )}

      {count > 1 && (
        <>
          <IconButton
            onClick={goPrev}
            sx={{
              position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.4)', color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={goNext}
            sx={{
              position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.4)', color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute', bottom: 14, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 0.75,
            }}
          >
            {photos.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => goTo(i)}
                sx={{
                  width: i === safeIndex ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: i === safeIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>

          <Typography
            variant="caption"
            sx={{
              position: 'absolute', bottom: 14, right: 12,
              bgcolor: 'rgba(0,0,0,0.45)', color: '#fff',
              px: 1, py: 0.25, borderRadius: 5,
            }}
          >
            {safeIndex + 1} / {count}
          </Typography>
        </>
      )}
    </Box>
  )
}
