// گزینه‌های هر بخش، برگرفته از فرم چاپی «کارگروه تحقیق و توسعه گردشگری - موسسه گردشگران پایدار گیل»

export const HABITAT_OPTIONS = ['جنگل', 'مرتع', 'باغ', 'کنار جاده', 'سایر']
export const SUBSTRATE_OPTIONS = ['خاک', 'چوب مرده', 'چوب زنده', 'لاشبرگ', 'بقایای گیاهی', 'سایر']
export const GROWTH_PATTERN_OPTIONS = ['منفرد', 'گروهی', 'دسته‌ای', 'حلقه‌ای']

export const CAP_SHAPE_OPTIONS = ['گرد', 'محدب', 'تخت', 'قیفی', 'تخم‌مرغی', 'سایر']
export const CAP_SURFACE_OPTIONS = ['صاف', 'فلس‌دار', 'پوسته‌پوسته', 'مخملی', 'لزج', 'سایر']
export const CAP_MARGIN_OPTIONS = ['صاف', 'شیاردار', 'موج‌دار', 'برگشته']

export const HYMENOPHORE_SHAPE_OPTIONS = ['تیغه‌دار', 'منفذدار', 'دندانه‌دار', 'صاف']

export const STIPE_PRESENCE_OPTIONS = ['دارد', 'ندارد']
export const STIPE_SHAPE_OPTIONS = ['باریک', 'ضخیم', 'پیازی', 'مخروطی']
export const STIPE_TEXTURE_OPTIONS = ['توپر', 'توخالی', 'نامشخص']
export const RING_OPTIONS = ['دارد', 'ندارد']
export const VOLVA_OPTIONS = ['دارد', 'ندارد']

export const FLESH_TEXTURE_OPTIONS = ['نرم', 'سفت', 'ژلاتینی', 'سایر']
export const COLOR_CHANGE_OPTIONS = ['تغییر می‌کند', 'بدون تغییر', 'نامشخص']

export const LATEX_OPTIONS = ['دارد', 'ندارد', 'بررسی نشد']
export const SMELL_OPTIONS = ['خنثی', 'تند', 'ملایم', 'نامطبوع', 'خوشبو / میوه‌ای', 'قابل تشخیص نیست']

export const PHOTO_TAGS = ['زیستگاه', 'بالای کلاهک', 'زیر کلاهک', 'برش عرضی', 'پایه', 'سایر']

export const WEATHER_QUICK_OPTIONS = ['آفتابی', 'ابری', 'بارانی', 'مه‌آلود', 'مرطوب پس از باران']

export function emptySample(tripId, order) {
  return {
    id: undefined, // در زمان ذخیره تنظیم می‌شود
    tripId,
    order,
    createdAt: Date.now(),
    updatedAt: Date.now(),

    location: '',
    altitude: '',
    habitat: [],
    habitatOther: '',
    substrate: [],
    substrateOther: '',
    growthPattern: [],

    cap: {
      shape: [],
      shapeOther: '',
      surface: [],
      surfaceOther: '',
      margin: [],
    },

    hymenophore: {
      shape: [],
      underColor: '',
    },

    stipe: {
      present: '',
      shape: [],
      texture: '',
      ring: '',
      volva: '',
      color: '',
    },

    flesh: {
      texture: [],
      textureOther: '',
      touchChange: '',
      cutChange: '',
    },

    latex: '',
    smell: '',
    sporePrintColor: '',
    sporePrintNotPrepared: false,

    notes: '',
    photos: [], // [{ id, tag, dataUrl }]
  }
}

export function emptyTrip() {
  return {
    id: undefined,
    title: '',
    date: new Date().toISOString().slice(0, 10),
    registrant: '',
    companions: '',
    region: '',
    weather: '',
    createdAt: Date.now(),
  }
}
