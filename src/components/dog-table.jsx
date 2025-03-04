import React from 'react'

const DogTable = ({dogs}) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 text-left font-medium">ลำดับที่</th>
            <th className="py-3 px-4 text-left font-medium">ชื่อสุนัข</th>
            <th className="py-3 px-4 text-left font-medium">สายพันธุ์</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map((dog,index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{index+1}</td>
              <td className="py-3 px-4">{dog.name}</td>
              <td className="py-3 px-4">{dog.breed}</td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  )
}

export default DogTable