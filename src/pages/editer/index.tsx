import React from 'react'

import { useEditerDataStore } from '@/store/editer-data'

const Editer = () => {
  const editer = useEditerDataStore()
  console.log('editer', editer)

  return <div>Editer</div>
}

export default Editer
