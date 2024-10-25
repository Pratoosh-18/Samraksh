import LostPersonCard from '@/components/lost-person-card'
import api from '@/utils/api'
import { useEffect, useState } from 'react'

const LostReportsPage = () => {
  const [lostReports, setLostReports] = useState([])

  const fetchReports = async () => {
    try {
      const res = await api.get("retrieve-lost-child-reports");
      console.log(res.data)
      setLostReports(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchReports();
  }, [])

  const groupedReports = {
    detected: lostReports.filter(person => person.status === "detected"),
    lost: lostReports.filter(person => person.status === "lost"),
    found: lostReports.filter(person => person.status === "found"),
  };

  return (
    <div className="mx-4 lg:mx-20 my-6">
      <h2>Lost People Reports</h2>

      <h2 className="text-2xl font-bold text-blue-600 mb-4">Detected</h2>
      <div className="flex w-full flex-wrap gap-4 mb-10">
        {groupedReports.detected.length > 0 ? (
          groupedReports.detected.map(person => (
            <LostPersonCard key={person.id} person={person} fetchReports={fetchReports}/>
          ))
        ) : (
          <p>No entries here</p>
        )}
      </div>

      <h2 className="text-2xl font-bold text-red-600 mb-4">Lost</h2>
      <div className="flex w-full flex-wrap gap-4 mb-10">
        {groupedReports.lost.length > 0 ? (
          groupedReports.lost.map(person => (
            <LostPersonCard key={person.id} person={person} fetchReports={fetchReports}/>
          ))
        ) : (
          <p>No entries here</p>
        )}
      </div>

      <h2 className="text-2xl font-bold text-green-600 mb-4">Found</h2>
      <div className="flex w-full flex-wrap gap-4 mb-10">
        {groupedReports.found.length > 0 ? (
          groupedReports.found.map(person => (
            <LostPersonCard key={person.id} person={person} fetchReports={fetchReports}/>
          ))
        ) : (
          <p>No entries here</p>
        )}
      </div>
    </div>
  )
}

export default LostReportsPage
