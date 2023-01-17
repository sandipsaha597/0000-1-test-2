import { List, ListItem, ListItemText } from '@mui/material'

const SmallItemList = ({ list }) => {
  return (
    <List disablePadding sx={{ fontSize: '14px' }}>
      {list.map((v, i) => (
        <ListItem
          key={v.text1}
          divider={i !== list.length - 1}
          sx={{ px: 0, '.MuiListItemText-primary': { fontSize: '0.72rem' } }}
        >
          <ListItemText
            primary={v.text1}
            sx={{
              width: '35%',
              flexGrow: 0,
            }}
          />
          <ListItemText primary={v.text2} />
        </ListItem>
      ))}
    </List>
  )
}

export default SmallItemList
