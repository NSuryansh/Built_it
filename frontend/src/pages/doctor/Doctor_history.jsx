import React, { useEffect, useState } from 'react'

const History = () => {
    const [app, setApp] = useState([])

    const getPastAppointments = async()=>{
        const docId = localStorage.getItem("userid")
        const response = await fetch(`http://localhost:3000/pastdocappt?doctorId=${docId}`)
        const data = await response.json()
        setApp(data)
    }

    useEffect(() => {
      getPastAppointments()
    }, [])

    useEffect(() => {
    console.log(app)
    }, [app])
    
  return (
    <div>
      
    </div>
  )
}

export default History
