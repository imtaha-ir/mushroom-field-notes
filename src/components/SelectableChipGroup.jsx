import { Box, Chip, Stack, Typography, TextField } from '@mui/material'

/**
 * گروه انتخاب چندگزینه‌ای/تک‌گزینه‌ای به شکل چیپ — جایگزین چک‌باکس‌های فرم کاغذی.
 *
 * multiple=false → value یک رشته است (مثل دارد/ندارد)
 * multiple=true  → value یک آرایه از رشته‌هاست (مثل زیستگاه که می‌تواند چند مورد باشد)
 *
 * اگر گزینه‌ی «سایر» انتخاب شود، یک فیلد متنی برای توضیح باز می‌شود.
 */
export default function SelectableChipGroup({
  label,
  options,
  value,
  onChange,
  multiple = true,
  otherValue,
  onOtherChange,
  dense = false,
}) {
  const isSelected = (opt) => (multiple ? (value || []).includes(opt) : value === opt)
  const showOtherField = options.includes('سایر') && isSelected('سایر')

  const toggle = (opt) => {
    if (multiple) {
      const current = value || []
      const next = current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt]
      onChange(next)
    } else {
      onChange(value === opt ? '' : opt)
    }
  }

  return (
    <Box sx={{ mb: dense ? 1.5 : 2.5 }}>
      {label && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
        {options.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            clickable
            color={isSelected(opt) ? 'primary' : 'default'}
            variant={isSelected(opt) ? 'filled' : 'outlined'}
            onClick={() => toggle(opt)}
            sx={{ borderRadius: '10px' }}
          />
        ))}
      </Stack>
      {showOtherField && (
        <TextField
          size="small"
          placeholder="توضیح مورد «سایر»"
          value={otherValue || ''}
          onChange={(e) => onOtherChange?.(e.target.value)}
          sx={{ mt: 1.5 }}
        />
      )}
    </Box>
  )
}
