import JSZip from 'jszip'
import { getSamplesByTrip } from '../db.js'

// همان تابع کمکی که در صفحه‌ی نمایش نمونه هم استفاده شده: چند گزینه‌ی انتخابی
// را به یک رشته‌ی خوانا تبدیل می‌کند و گزینه‌ی «سایر» را همراه با توضیحش می‌آورد.
function formatList(values, otherValue) {
  if (!values || values.length === 0) return ''
  return values.map((v) => (v === 'سایر' && otherValue ? `سایر (${otherValue})` : v)).join('، ')
}

function section(rows) {
  const filled = rows.filter((r) => r.value)
  if (!filled.length) return ''
  return filled.map((r) => `${r.label}: ${r.value}`).join('\n')
}

function sampleToText(sample) {
  const blocks = [
    section([
      { label: 'محل مشاهده', value: sample.location },
      { label: 'زیستگاه', value: formatList(sample.habitat, sample.habitatOther) },
      { label: 'بستر رویش', value: formatList(sample.substrate, sample.substrateOther) },
      { label: 'نحوه رویش', value: formatList(sample.growthPattern) },
    ]),
    section([
      { label: 'شکل کلاهک', value: formatList(sample.cap?.shape, sample.cap?.shapeOther) },
      { label: 'سطح کلاهک', value: formatList(sample.cap?.surface, sample.cap?.surfaceOther) },
      { label: 'حاشیه کلاهک', value: formatList(sample.cap?.margin) },
      { label: 'رنگ کلاهک', value: sample.cap?.color },
      { label: 'تغییر رنگ کلاهک', value: sample.cap?.colorChange },
    ]),
    section([
      { label: 'شکل زیر کلاهک', value: formatList(sample.hymenophore?.shape) },
      { label: 'رنگ زیر کلاهک', value: sample.hymenophore?.underColor },
    ]),
    section([
      { label: 'پایه (دارد/ندارد)', value: sample.stipe?.present },
      { label: 'شکل پایه', value: formatList(sample.stipe?.shape, sample.stipe?.shapeOther) },
      { label: 'توپر/توخالی', value: sample.stipe?.texture },
      { label: 'حلقه (Ring)', value: sample.stipe?.ring },
      { label: 'ولوا (Volva)', value: sample.stipe?.volva },
      { label: 'رنگ پایه', value: sample.stipe?.color },
    ]),
    section([
      { label: 'بافت گوشت', value: formatList(sample.flesh?.texture, sample.flesh?.textureOther) },
      { label: 'رنگ گوشت', value: sample.flesh?.color },
      { label: 'تغییر رنگ (لمس/فشار)', value: sample.flesh?.touchChange },
      { label: 'تغییر رنگ (برش)', value: sample.flesh?.cutChange },
    ]),
    section([
      { label: 'شیره یا لاتکس', value: sample.latex },
      { label: 'بو', value: sample.smell },
      { label: 'اسپورپرینت', value: sample.sporePrintNotPrepared ? 'تهیه نشد' : sample.sporePrintColor },
    ]),
    sample.notes ? `یادداشت: ${sample.notes}` : '',
  ].filter(Boolean)
  return blocks.length ? blocks.join('\n\n') : 'اطلاعاتی برای این نمونه ثبت نشده است.'
}

function sanitizeFilename(str) {
  return (str || '').toString().trim().replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80) || 'بدون-نام'
}

export function buildTripReportText(trip, samples) {
  const header = [
    `تور: ${trip.title || '-'}`,
    trip.date ? `تاریخ سفر: ${trip.date}` : '',
    trip.region ? `منطقه/مسیر: ${trip.region}` : '',
    trip.registrant ? `ثبت‌کننده: ${trip.registrant}` : '',
    trip.companions ? `همراهان: ${trip.companions}` : '',
    trip.weather ? `شرایط آب‌وهوایی: ${trip.weather}` : '',
    `تعداد نمونه‌های ثبت‌شده: ${samples.length}`,
  ].filter(Boolean).join('\n')

  if (!samples.length) {
    return `${header}\n\nهنوز نمونه‌ای برای این برنامه ثبت نشده است.\n`
  }

  const body = samples.map((s) => {
    const photoNames = (s.photos || []).map((_, pi) => `photos/نمونه-${s.order}-${pi + 1}.jpg`)
    const photosLine = photoNames.length ? `عکس‌ها: ${photoNames.join('، ')}` : 'عکس‌ها: ثبت نشده'
    return `------------------------------\nنمونه ${s.order}\n------------------------------\n${sampleToText(s)}\n\n${photosLine}`
  }).join('\n\n')

  return `${header}\n\n${body}\n`
}

export async function buildTripZip(trip, samples) {
  const zip = new JSZip()
  zip.file('گزارش.txt', buildTripReportText(trip, samples))

  const photosFolder = zip.folder('photos')
  samples.forEach((s) => {
    (s.photos || []).forEach((photo, pi) => {
      const base64 = (photo.dataUrl || '').split(',')[1]
      if (base64) photosFolder.file(`نمونه-${s.order}-${pi + 1}.jpg`, base64, { base64: true })
    })
  })

  return zip.generateAsync({ type: 'blob' })
}

/**
 * تلاش برای باز کردن منوی اشتراک‌گذاری بومی سیستم‌عامل (با فایل زیپ پیوست‌شده).
 * اگر مرورگر از اشتراک‌گذاری فایل پشتیبانی نکند (مثلاً روی دسکتاپ)، به‌جای آن
 * فایل به‌صورت مستقیم دانلود می‌شود.
 */
export async function shareOrDownloadZip(blob, filename) {
  const file = new File([blob], filename, { type: 'application/zip' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename })
      return 'shared'
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
      // در صورت خطای دیگر، به روش دانلود مستقیم برمی‌گردیم
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  return 'downloaded'
}

/** ساخت زیپ برنامه (با نمونه‌هایی که از پایگاه‌داده گرفته می‌شود) و اشتراک‌گذاری/دانلود آن */
export async function shareTrip(trip) {
  const samples = await getSamplesByTrip(trip.id)
  const blob = await buildTripZip(trip, samples)
  const filename = `${sanitizeFilename(trip.title)}${trip.date ? '-' + trip.date : ''}.zip`
  return shareOrDownloadZip(blob, filename)
}
