import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Pagination,
  PaginationItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import moment from 'moment/moment'

import axios from 'axios'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import CloseIcon from '@mui/icons-material/Close'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined'

import SelectDropDown from '../molecules/Dropdowns/SelectDropDown'
import LaunchStatusChip from '../atoms/Chip/LaunchStatusChip'
import SmallItemList from './../molecules/Lists/SmallItemList'

const useTableData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState('')
  const { pageNumber } = useParams()
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const queryObj = (() => {
      switch (searchParams.get('launch-status')) {
        case 'all-launches':
          return {}
        case 'upcoming-launches':
          return { upcoming: true }
        case 'successful-launches':
          return { success: true }
        case 'failed-launches':
          return { upcoming: false, success: false }

        default:
          return {}
      }
    })()

    ;(async () => {
      try {
        setLoading(true)
        const fetchedData = await axios.post(
          'https://api.spacexdata.com/v4/launches/query',
          {
            query: queryObj,
            options: {
              page: pageNumber ?? 1,
              limit: 12,
              populate: ['rocket', 'launchpad'],
            },
          }
        )
        setLoading(false)
        setData(fetchedData.data)
      } catch (err) {
        console.error(err)
        setLoading(false)
        setErrMsg('some error occurred')
      }
    })()
  }, [pageNumber, searchParams])

  return [data, loading, errMsg]
}

const BrowseAllLaunches = () => {
  const [tableData, loading, errMsg] = useTableData()
  const { pageNumber } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeModalFlightNumber, setActiveModalFlightNumber] = useState(0)

  const { docs } = tableData || {}
  const {
    name: missionName,
    flight_number,
    date_utc: launchDateInUTC,
    launchpad,
    rocket,
    links,
    upcoming: launchStatusUpcoming,
    success: launchStatusSuccess,
    details: launchDetails,
  } = docs?.find((doc) => doc.flight_number === activeModalFlightNumber) || {}
  const { name: launchLocation } = launchpad || {}
  const {
    name: rocketName,
    engines: rocketEngine,
    company: rocketEngineCompany,
    country,
  } = rocket || {}
  const { type: rocketEngineType } = rocketEngine || {}

  const {
    patch: imageLinks,
    wikipedia: missionWikipediaLink,
    webcast: youtubeLink,
    article: articleLink,
  } = links || {}
  const { small: smallImageLink } = imageLinks || {}

  const tableModalListArray = [
    {
      text1: 'Flight Number',
      text2: flight_number,
    },
    { text1: 'Mission Name', text2: missionName },
    { text1: 'Rocket Type', text2: rocketEngineType },
    { text1: 'Rocket Name', text2: rocketName },
    { text1: 'Manufacturer', text2: rocketEngineCompany },
    { text1: 'Nationality', text2: country },
    {
      text1: 'Launch Date',
      text2: moment(launchDateInUTC).format('DD MMMM YYYY HH:mm'),
    },
    // Sorry couldn't find payload type. payload is an array
    { text1: 'Payload Type', text2: `couldn't find` },
    { text1: 'Orbit', text2: `couldn't find` },
    { text1: 'Launch Site', text2: launchLocation },
  ]

  const closeModal = () => setActiveModalFlightNumber(0)

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <SelectDropDown
          value={'past-6-months'}
          startIcon={
            <CalendarTodayOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          }
          options={[{ value: 'past-6-months', name: 'Past 6 Months' }]}
          disabled
        />
        <SelectDropDown
          value={searchParams.get('launch-status') || 'all-launches'}
          options={[
            { value: 'all-launches', name: 'All Launches' },
            { value: 'upcoming-launches', name: 'Upcoming Launches' },
            { value: 'successful-launches', name: 'Successful Launches' },
            { value: 'failed-launches', name: 'Failed Launches' },
          ]}
          onChange={(e) => {
            const value = e.target.value
            setSearchParams((prev) => {
              prev.set('launch-status', value)
              return prev
            })
          }}
          startIcon={<FilterAltOutlinedIcon fontSize="small" sx={{ mr: 1 }} />}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'primary.dark',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
        }}
        elevation={0}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '.MuiTableCell-root': {
                py: 1,
                fontWeight: 'bold',
              },
            }}
          >
            <TableRow>
              <TableCell sx={{ pl: 4 }}>No:</TableCell>
              <TableCell>Launched (UTC)</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Mission</TableCell>
              <TableCell align="center">Orbit</TableCell>
              <TableCell align="center">Launch Status</TableCell>
              <TableCell>Rocket</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              !errMsg &&
              tableData.docs?.map(
                ({
                  id,
                  flight_number,
                  name: missionName,
                  upcoming,
                  success,
                  date_utc: launchDateInUTC,
                  launchpad: { name: launchLocation },
                  rocket: { name: rocketName },
                }) => (
                  <TableRow
                    key={id}
                    onClick={() => setActiveModalFlightNumber(flight_number)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                      '.MuiTableCell-root': {
                        border: 'none',
                      },
                    }}
                  >
                    <TableCell sx={{ pl: 4 }}>{flight_number}</TableCell>
                    <TableCell>
                      {moment(launchDateInUTC).format('DD MMMM YYYY HH:mm')}
                    </TableCell>
                    <TableCell>{launchLocation}</TableCell>
                    <TableCell>{missionName}</TableCell>
                    {/* I tried to find the orbit field but sorry I couldn't find it. */}
                    {/* rocket.payload_weights array has values like "leo", "gto", "mars" etc. I am not sure if that's what supposed to be here or not */}
                    <TableCell align="center">Couldn't find</TableCell>
                    <TableCell align="center">
                      <LaunchStatusChip status={{ upcoming, success }} />
                    </TableCell>
                    <TableCell>{rocketName}</TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
        {pageNumber > tableData.totalPages && (
          <Typography textAlign="center" mt={4}>
            Page number {pageNumber} doesn't exist for specific filter
          </Typography>
        )}
        {tableData.totalDocs === 0 && (
          <Typography textAlign="center" mt={4}>
            No results found for the specific filter
          </Typography>
        )}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <CircularProgress
              sx={{
                color: 'primary.dark',
              }}
            />
          </Box>
        )}
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" pt={3}>
        {/* pixel perfect UI wasn't required that's why I skipped the styling of this pagination component */}
        <Pagination
          variant="outlined"
          shape="rounded"
          count={tableData.totalPages}
          page={Number(pageNumber) || 1}
          disabled={loading}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              // Below "to" prop is a "Link" component prop not a "PaginationItem" prop
              to={`/browseAllLaunches/page/${
                item.page
              }?${searchParams.toString()}`}
              {...item}
            />
          )}
        />
      </Box>
      {!loading && !errMsg && (
        <Modal open={!!activeModalFlightNumber} onClose={closeModal}>
          <Box
            sx={{
              background: '#fff',
              borderRadius: 2,
              p: 4,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              maxHeight: '73vh',
              overflowY: 'auto',
              outline: 'none'
            }}
          >
            <Box display="flex" justifyContent="flex-end">
              <Button
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  color: 'primary.dark',
                  position: 'absolute',
                }}
                onClick={closeModal}
              >
                <CloseIcon />
              </Button>
            </Box>
            <Box display="flex">
              <Box mr={2}>
                <img src={smallImageLink} alt="launch emblem" width="80px" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6">
                  <Box component="span" mr={1}>
                    {missionName}
                  </Box>
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'primary.dark',
                  }}
                >
                  {rocketName}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    color: 'primary.main',
                    '> *': {
                      mr: 1,
                    },
                  }}
                >
                  {[
                    { link: articleLink, Icon: ArticleOutlinedIcon },
                    {
                      link: missionWikipediaLink,
                      Icon: MenuBookOutlinedIcon,
                    },
                    { link: youtubeLink, Icon: SubscriptionsOutlinedIcon },
                  ].map((v, i) => (
                    <a
                      key={i}
                      href={v.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <v.Icon fontSize="small" />
                    </a>
                  ))}
                </Box>
              </Box>
              <Box>
                <LaunchStatusChip
                  status={{
                    upcoming: launchStatusUpcoming,
                    success: launchStatusSuccess,
                  }}
                />
              </Box>
            </Box>
            <Typography
              component="p"
              variant="body2"
              py={2}
              sx={{
                a: {
                  textDecoration: 'none',
                },
              }}
            >
              {launchDetails}{' '}
              <a
                href={missionWikipediaLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia
              </a>
            </Typography>
            <SmallItemList list={tableModalListArray} />
          </Box>
        </Modal>
      )}
    </>
  )
}

export default BrowseAllLaunches
