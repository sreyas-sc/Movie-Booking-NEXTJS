import React from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'

const homepage = () => {
  return (
    <Box width={'100%'} height={'100%'} margin="auto" marginTop={2}>
        <Box margin="auto" width={'80%'} height={'40%'} padding={2}>
            <Image src='https://assets-in.bmscdn.com/iedb/movies/images/extra/horizontal_no_logo/mobile/listing/xxlarge/twisters-et00387070-1723539828.jpg' alt='Unable to load image'/>
        </Box>
    </Box>
  )
}

export default homepage