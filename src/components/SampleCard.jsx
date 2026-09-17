import { Card, CardActionArea, Box, Typography, Stack, Avatar, IconButton } from '@mui/material'
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

function summarize(sample) {
  const parts = []
  if (sample.cap?.shape?.length) parts.push(`کلاهک ${sample.cap.shape[0]}`)
  if (sample.habitat?.length) parts.push(sample.habitat[0])
  if (sample.stipe?.color) parts.push(`پایه ${sample.stipe.color}`)
  return parts.join(' · ')
}

export default function SampleCard({ sample, onClick, onMenuClick }) {
  const thumb = sample.photos?.[0]?.dataUrl
  const summary = summarize(sample)

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardActionArea onClick={onClick} sx={{ p: 1.5, display: 'flex', alignItems: 'center' }}>
        {thumb ? (
          <Avatar variant="rounded" src={thumb} sx={{ width: 56, height: 56, borderRadius: 2 }} />
        ) : (
          <Avatar variant="rounded" sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'background.default', color: 'text.secondary' }}>
            <EmojiNatureOutlinedIcon />
          </Avatar>
        )}
        <Box sx={{ mr: 1.5, ml: 1, flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            نمونه {sample.order} {sample.location ? `— ${sample.location}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {summary || 'اطلاعات تکمیل نشده'}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onMenuClick(e) }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </CardActionArea>
    </Card>
  )
}
