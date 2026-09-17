import { useRef, useState } from 'react'
import {
  Box, ImageList, ImageListItem, IconButton, Menu, MenuItem,
  Button, Stack, Typography, Chip,
} from '@mui/material'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import { compressImage } from '../utils/image.js'
import { genId } from '../db.js'
import { PHOTO_TAGS } from '../constants/formOptions.js'

export default function PhotoManager({ photos, onChange }) {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [tagMenu, setTagMenu] = useState({ anchor: null, photoId: null })

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setBusy(true)
    try {
      const newPhotos = []
      for (const file of files) {
        const dataUrl = await compressImage(file)
        newPhotos.push({ id: genId(), tag: '', dataUrl })
      }
      onChange([...(photos || []), ...newPhotos])
    } finally {
      setBusy(false)
    }
  }

  const removePhoto = (id) => onChange(photos.filter((p) => p.id !== id))
  const setTag = (id, tag) => onChange(photos.map((p) => (p.id === id ? { ...p, tag } : p)))

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CameraAltOutlinedIcon />}
          onClick={() => cameraInputRef.current?.click()}
          disabled={busy}
        >
          گرفتن عکس
        </Button>
        <Button
          variant="outlined"
          startIcon={<PhotoLibraryOutlinedIcon />}
          onClick={() => galleryInputRef.current?.click()}
          disabled={busy}
        >
          انتخاب از گالری
        </Button>
      </Stack>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
      />

      {busy && <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>در حال پردازش عکس…</Typography>}

      {photos?.length > 0 ? (
        <ImageList cols={3} gap={10} sx={{ m: 0 }}>
          {photos.map((photo) => (
            <ImageListItem key={photo.id} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <img src={photo.dataUrl} alt={photo.tag || 'نمونه قارچ'} style={{ aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 8 }} />
              <IconButton
                size="small"
                onClick={() => removePhoto(photo.id)}
                sx={{
                  position: 'absolute', top: 4, left: 4,
                  bgcolor: 'rgba(0,0,0,0.55)', color: '#fff',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Chip
                size="small"
                icon={<LabelOutlinedIcon sx={{ fontSize: 15 }} />}
                label={photo.tag || 'برچسب'}
                onClick={(e) => setTagMenu({ anchor: e.currentTarget, photoId: photo.id })}
                sx={{
                  position: 'absolute', bottom: 4, right: 4, left: 4,
                  bgcolor: 'rgba(255,255,255,0.92)',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography variant="body2" color="text.secondary">هنوز عکسی ثبت نشده است.</Typography>
      )}

      <Menu
        anchorEl={tagMenu.anchor}
        open={Boolean(tagMenu.anchor)}
        onClose={() => setTagMenu({ anchor: null, photoId: null })}
      >
        {PHOTO_TAGS.map((tag) => (
          <MenuItem
            key={tag}
            onClick={() => { setTag(tagMenu.photoId, tag); setTagMenu({ anchor: null, photoId: null }) }}
          >
            {tag}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
