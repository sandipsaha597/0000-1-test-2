import { Divider } from '@mui/material'
import { Box } from '@mui/system'
import SpaceXLogo from './../../atoms/Logo/SpaceXLogo'
const AppHeader = () => {
  return (
    <>
      <Box
        component="header"
        sx={{
          textAlign: 'center',
          pt: 2,
        }}
      >
        <SpaceXLogo />
        <Box pt={2}>
          <Divider light />
        </Box>
      </Box>
    </>
  )
}

export default AppHeader
