import { Container } from '@mui/material'

import AppHeader from '../molecules/Display/AppHeader'
import BrowseAllLaunches from '../organisms/BrowseAllLaunches'

const HomePage = () => {
  return (
    <>
      <AppHeader />
      <Container
        component="main"
        sx={{
          pt: 4,
          pb: 8,
        }}
      >
        <BrowseAllLaunches />
      </Container>
    </>
  )
}

export default HomePage
