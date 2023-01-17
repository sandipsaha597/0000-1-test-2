import { Box, MenuItem, Select } from '@mui/material'

const SelectDropDown = ({ startIcon, value, options, onChange, disabled }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ opacity: disabled ? 0.3 : 1 }}
    >
      {/* TODO: clicking on the icon should open the dropdown */}
      {startIcon}
      <Select
        disabled={disabled}
        variant="standard"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={onChange}
        sx={{
          '&:disabled': {
            opacity: 'inherit',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

export default SelectDropDown
