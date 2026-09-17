// تبدیل فایل عکس گرفته‌شده از دوربین/گالری به یک dataURL فشرده،
// تا حجم پایگاه‌داده محلی برای استفاده‌ی طولانی‌مدت آفلاین منطقی بماند.

export function compressImage(file, { maxDimension = 1280, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      img.onerror = () => reject(new Error('تصویر قابل خواندن نیست'))
      img.onload = () => {
        let { width, height } = img
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
