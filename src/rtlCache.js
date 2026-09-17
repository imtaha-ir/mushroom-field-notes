import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

// کش Emotion با پلاگین RTL تا استایل‌های MUI (فاصله‌ها، جهت آیکون‌ها و ...) به‌درستی از راست به چپ بچینند
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

export default rtlCache
