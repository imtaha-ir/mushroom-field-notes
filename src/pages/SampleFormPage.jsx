import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AppBar, Toolbar, IconButton, Typography, Container, Stack, Box,
  Accordion, AccordionSummary, AccordionDetails, TextField,
  FormControlLabel, Switch, CircularProgress, Button,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined'
import BlurCircularOutlinedIcon from '@mui/icons-material/BlurCircularOutlined'
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined'
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined'
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined'

import SelectableChipGroup from '../components/SelectableChipGroup.jsx'
import PhotoManager from '../components/PhotoManager.jsx'
import { getSample, saveSample, nextSampleOrder, genId } from '../db.js'
import {
  emptySample,
  HABITAT_OPTIONS, SUBSTRATE_OPTIONS, GROWTH_PATTERN_OPTIONS,
  CAP_SHAPE_OPTIONS, CAP_SURFACE_OPTIONS, CAP_MARGIN_OPTIONS,
  HYMENOPHORE_SHAPE_OPTIONS,
  STIPE_PRESENCE_OPTIONS, STIPE_SHAPE_OPTIONS, STIPE_TEXTURE_OPTIONS, RING_OPTIONS, VOLVA_OPTIONS,
  FLESH_TEXTURE_OPTIONS, COLOR_CHANGE_OPTIONS,
  LATEX_OPTIONS, SMELL_OPTIONS,
} from '../constants/formOptions.js'

export default function SampleFormPage() {
  const { tripId, sampleId } = useParams()
  const navigate = useNavigate()
  const isNew = !sampleId || sampleId === 'new'

  const [sample, setSample] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState('location')
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      if (isNew) {
        const order = await nextSampleOrder(tripId)
        setSample(emptySample(tripId, order))
      } else {
        const existing = await getSample(sampleId)
        setSample(existing || emptySample(tripId, 1))
      }
      setLoading(false)
    })()
  }, [tripId, sampleId, isNew])

  const patch = (fields) => setSample((s) => ({ ...s, ...fields }))
  const patchGroup = (group) => (fields) =>
    setSample((s) => ({ ...s, [group]: { ...s[group], ...fields } }))
  const patchCap = patchGroup('cap')
  const patchHymenophore = patchGroup('hymenophore')
  const patchStipe = patchGroup('stipe')
  const patchFlesh = patchGroup('flesh')

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('مرورگر شما از موقعیت‌یابی GPS پشتیبانی نمی‌کند')
      return
    }
    setLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        patch({ location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` })
        setLocating(false)
      },
      (err) => {
        setLocationError('دریافت موقعیت ناموفق بود' + (err?.message ? `: ${err.message}` : ''))
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  const handleSave = async () => {
    const toSave = {
      ...sample,
      id: sample.id || genId(),
      updatedAt: Date.now(),
    }
    await saveSample(toSave)
    navigate(`/trip/${tripId}`)
  }

  if (loading || !sample) {
    return <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress size={28} /></Stack>
  }

  const accordionProps = (key) => ({
    expanded: expanded === key,
    onChange: (_, isExp) => setExpanded(isExp ? key : false),
  })

  return (
    <Box sx={{ pb: 6, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(`/trip/${tripId}`)} sx={{ ml: 1 }}>
            <ArrowForwardIcon />
          </IconButton>
          <Typography variant="h6" component="h1" noWrap sx={{ flex: 1 }}>
            {isNew ? 'نمونه جدید' : `ویرایش نمونه ${sample.order}`}
          </Typography>
          <Button onClick={handleSave} variant="contained" startIcon={<CheckIcon />}>
            ذخیره
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 2 }}>
        <Stack spacing={1.5}>

          {/* محل مشاهده و محیط */}
          <Accordion {...accordionProps('location')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <TerrainOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">محل مشاهده و محیط رویش</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box>
                  <TextField
                    label="محل دقیق مشاهده"
                    value={sample.location}
                    onChange={(e) => patch({ location: e.target.value })}
                    placeholder="مختصات GPS یا توضیح مکانی"
                  />
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={locating ? <CircularProgress size={16} /> : <MyLocationOutlinedIcon />}
                      onClick={handleUseGPS}
                      disabled={locating}
                    >
                      دریافت موقعیت از GPS
                    </Button>
                    {locationError && (
                      <Typography variant="caption" color="error">{locationError}</Typography>
                    )}
                  </Stack>
                </Box>
                <SelectableChipGroup
                  label="زیستگاه"
                  options={HABITAT_OPTIONS}
                  value={sample.habitat}
                  onChange={(v) => patch({ habitat: v })}
                  otherValue={sample.habitatOther}
                  onOtherChange={(v) => patch({ habitatOther: v })}
                />
                <SelectableChipGroup
                  label="بستر رویش"
                  options={SUBSTRATE_OPTIONS}
                  value={sample.substrate}
                  onChange={(v) => patch({ substrate: v })}
                  otherValue={sample.substrateOther}
                  onOtherChange={(v) => patch({ substrateOther: v })}
                />
                <SelectableChipGroup
                  label="نحوه رویش"
                  options={GROWTH_PATTERN_OPTIONS}
                  value={sample.growthPattern}
                  onChange={(v) => patch({ growthPattern: v })}
                  dense
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* کلاهک */}
          <Accordion {...accordionProps('cap')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <BlurCircularOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">کلاهک (Cap)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <SelectableChipGroup
                  label="شکل"
                  options={CAP_SHAPE_OPTIONS}
                  value={sample.cap.shape}
                  onChange={(v) => patchCap({ shape: v })}
                  otherValue={sample.cap.shapeOther}
                  onOtherChange={(v) => patchCap({ shapeOther: v })}
                />
                <SelectableChipGroup
                  label="سطح"
                  options={CAP_SURFACE_OPTIONS}
                  value={sample.cap.surface}
                  onChange={(v) => patchCap({ surface: v })}
                  otherValue={sample.cap.surfaceOther}
                  onOtherChange={(v) => patchCap({ surfaceOther: v })}
                />
                <SelectableChipGroup
                  label="حاشیه"
                  options={CAP_MARGIN_OPTIONS}
                  value={sample.cap.margin}
                  onChange={(v) => patchCap({ margin: v })}
                  dense
                />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    رنگ
                  </Typography>
                  <TextField
                    label="رنگ کلاهک"
                    value={sample.cap.color}
                    onChange={(e) => patchCap({ color: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="تغییرات رنگی"
                    value={sample.cap.colorChange}
                    onChange={(e) => patchCap({ color: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  {/* <SelectableChipGroup
                    label="تغییر رنگ"
                    options={COLOR_CHANGE_OPTIONS}
                    value={sample.cap.colorChange}
                    onChange={(v) => patchCap({ colorChange: v })}
                    multiple={false}
                    dense
                  /> */}
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* زیر کلاهک */}
          <Accordion {...accordionProps('hymenophore')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ViewStreamOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">سطح زیر کلاهک (Hymenophore)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <SelectableChipGroup
                  label="شکل"
                  options={HYMENOPHORE_SHAPE_OPTIONS}
                  value={sample.hymenophore.shape}
                  onChange={(v) => patchHymenophore({ shape: v })}
                  dense
                />
                <TextField
                  label="رنگ زیر کلاهک"
                  value={sample.hymenophore.underColor}
                  onChange={(e) => patchHymenophore({ underColor: e.target.value })}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* پایه */}
          <Accordion {...accordionProps('stipe')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <HeightOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">پایه (Stipe)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <SelectableChipGroup
                  label="دارد / ندارد"
                  options={STIPE_PRESENCE_OPTIONS}
                  value={sample.stipe.present}
                  onChange={(v) => patchStipe({ present: v })}
                  multiple={false}
                  dense
                />
                {sample.stipe.present === 'دارد' && (
                  <>
                    <SelectableChipGroup
                      label="شکل"
                      options={STIPE_SHAPE_OPTIONS}
                      value={sample.stipe.shape}
                      onChange={(v) => patchStipe({ shape: v })}
                      otherValue={sample.stipe.shapeOther}
                      onOtherChange={(v) => patchStipe({ shapeOther: v })}
                    />
                    <SelectableChipGroup
                      label="توپر / توخالی"
                      options={STIPE_TEXTURE_OPTIONS}
                      value={sample.stipe.texture}
                      onChange={(v) => patchStipe({ texture: v })}
                      multiple={false}
                    />
                    <SelectableChipGroup
                      label="حلقه (Ring)"
                      options={RING_OPTIONS}
                      value={sample.stipe.ring}
                      onChange={(v) => patchStipe({ ring: v })}
                      multiple={false}
                      dense
                    />
                    <SelectableChipGroup
                      label="ولوا (Volva)"
                      options={VOLVA_OPTIONS}
                      value={sample.stipe.volva}
                      onChange={(v) => patchStipe({ volva: v })}
                      multiple={false}
                      dense
                    />
                    <TextField
                      label="رنگ پایه"
                      value={sample.stipe.color}
                      onChange={(e) => patchStipe({ color: e.target.value })}
                    />
                  </>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* گوشت قارچ */}
          <Accordion {...accordionProps('flesh')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <TextureOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">گوشت قارچ و تغییر رنگ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <SelectableChipGroup
                  label="بافت"
                  options={FLESH_TEXTURE_OPTIONS}
                  value={sample.flesh.texture}
                  onChange={(v) => patchFlesh({ texture: v })}
                  otherValue={sample.flesh.textureOther}
                  onOtherChange={(v) => patchFlesh({ textureOther: v })}
                />
                <TextField
                  label="رنگ گوشت"
                  value={sample.flesh.color}
                  onChange={(e) => patchFlesh({ color: e.target.value })}
                />
                <SelectableChipGroup
                  label="تغییر رنگ در اثر لمس / فشار"
                  options={COLOR_CHANGE_OPTIONS}
                  value={sample.flesh.touchChange}
                  onChange={(v) => patchFlesh({ touchChange: v })}
                  multiple={false}
                  dense
                />
                <SelectableChipGroup
                  label="تغییر رنگ در اثر برش"
                  options={COLOR_CHANGE_OPTIONS}
                  value={sample.flesh.cutChange}
                  onChange={(v) => patchFlesh({ cutChange: v })}
                  multiple={false}
                  dense
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* سایر ویژگی‌ها */}
          <Accordion {...accordionProps('other')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ScienceOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">شیره، بو و اسپورپرینت</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <SelectableChipGroup
                  label="شیره یا لاتکس"
                  options={LATEX_OPTIONS}
                  value={sample.latex}
                  onChange={(v) => patch({ latex: v })}
                  multiple={false}
                  dense
                />
                <SelectableChipGroup
                  label="بو"
                  options={SMELL_OPTIONS}
                  value={sample.smell}
                  onChange={(v) => patch({ smell: v })}
                  multiple={false}
                />
                <TextField
                  label="رنگ اسپورپرینت"
                  value={sample.sporePrintColor}
                  onChange={(e) => patch({ sporePrintColor: e.target.value })}
                  disabled={sample.sporePrintNotPrepared}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={sample.sporePrintNotPrepared}
                      onChange={(e) => patch({ sporePrintNotPrepared: e.target.checked, sporePrintColor: e.target.checked ? '' : sample.sporePrintColor })}
                    />
                  }
                  label="اسپورپرینت تهیه نشد"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* عکس‌ها */}
          <Accordion {...accordionProps('photos')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <PhotoCameraOutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">عکس‌ها ({sample.photos.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PhotoManager photos={sample.photos} onChange={(photos) => patch({ photos })} />
            </AccordionDetails>
          </Accordion>

          {/* یادداشت */}
          <Accordion {...accordionProps('notes')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <StickyNote2OutlinedIcon sx={{ ml: 1.2, color: 'primary.main' }} />
              <Typography variant="subtitle1">یادداشت‌های تکمیلی</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                value={sample.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                multiline
                minRows={4}
                placeholder="هر نکته‌ی تکمیلی درباره‌ی این نمونه…"
              />
            </AccordionDetails>
          </Accordion>

        </Stack>

        <Button
          onClick={handleSave}
          variant="contained"
          fullWidth
          size="large"
          startIcon={<CheckIcon />}
          sx={{ mt: 3 }}
        >
          ذخیره نمونه
        </Button>
      </Container>
    </Box>
  )
}
