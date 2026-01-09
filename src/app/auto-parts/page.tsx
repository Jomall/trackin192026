'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AutoPart {
  id: number
  name: string
  partNumber?: string
  description?: string
  quantity: number
  price?: number
  photo?: string
  licensePlate?: string
  vin?: string
}

export default function AutoParts() {
  const [parts, setParts] = useState<AutoPart[]>([])
  const [newPart, setNewPart] = useState({ name: '', partNumber: '', description: '', quantity: 0, price: 0, photo: '', licensePlate: '', vin: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredParts, setFilteredParts] = useState<AutoPart[]>([])
  const [vehicleParts, setVehicleParts] = useState<AutoPart[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [uniqueVehicles, setUniqueVehicles] = useState<{licensePlate: string, vin: string}[]>([])

  useEffect(() => {
    // TODO: Fetch parts from API
    setParts([
      { id: 1, name: 'Brake Pad', partNumber: 'BP001', description: 'Front brake pads', quantity: 50, price: 25.99 },
      { id: 2, name: 'Oil Filter', partNumber: 'OF002', description: 'Engine oil filter', quantity: 30, price: 8.50 },
    ])
  }, [])

  useEffect(() => {
    const vehicles = parts
      .filter(part => part.licensePlate && part.vin)
      .map(part => ({ licensePlate: part.licensePlate!, vin: part.vin! }))
      .filter((vehicle, index, self) => self.findIndex(v => v.licensePlate === vehicle.licensePlate && v.vin === vehicle.vin) === index)
    setUniqueVehicles(vehicles)
  }, [parts])

  useEffect(() => {
    if (newPart.licensePlate && newPart.vin) {
      const partsForVehicle = parts.filter(part => part.licensePlate === newPart.licensePlate && part.vin === newPart.vin)
      setVehicleParts(partsForVehicle)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [newPart.licensePlate, newPart.vin, parts])

  useEffect(() => {
    if (searchTerm) {
      const filtered = parts.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (part.partNumber && part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.description && part.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.licensePlate && part.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.vin && part.vin.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredParts(filtered)
    } else {
      setFilteredParts([])
    }
  }, [searchTerm, parts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add part via API
    const part: AutoPart = {
      id: Date.now(),
      ...newPart
    }
    setParts([...parts, part])
    setNewPart({ name: '', partNumber: '', description: '', quantity: 0, price: 0, photo: '', licensePlate: '', vin: '' })
  }

  const deletePart = (id: number) => {
    setParts(parts.filter(part => part.id !== id))
  }

  const selectPart = (part: AutoPart) => {
    setNewPart({
      name: part.name,
      partNumber: part.partNumber || '',
      description: part.description || '',
      quantity: part.quantity,
      price: part.price || 0,
      photo: part.photo || '',
      licensePlate: part.licensePlate || '',
      vin: part.vin || ''
    })
    setShowDropdown(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Auto Parts Inventory</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Auto Part</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
              <input
                type="text"
                value={newPart.name}
                onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
              <input
                type="text"
                value={newPart.partNumber}
                onChange={(e) => setNewPart({...newPart, partNumber: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newPart.description}
                onChange={(e) => setNewPart({...newPart, description: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={newPart.quantity}
                onChange={(e) => setNewPart({...newPart, quantity: parseInt(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={newPart.price}
                onChange={(e) => setNewPart({...newPart, price: parseFloat(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setNewPart({...newPart, photo: reader.result as string});
                    reader.readAsDataURL(file);
                  }
                }}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                value={newPart.licensePlate}
                onChange={(e) => setNewPart({...newPart, licensePlate: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={newPart.vin}
                onChange={(e) => setNewPart({...newPart, vin: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Existing Vehicle (License Plate + VIN):</label>
              <select
                onChange={(e) => {
                  const selectedVehicle = uniqueVehicles.find(vehicle => vehicle.licensePlate + ' - ' + vehicle.vin === e.target.value)
                  if (selectedVehicle) {
                    setNewPart({...newPart, licensePlate: selectedVehicle.licensePlate, vin: selectedVehicle.vin})
                    setShowDropdown(true)
                  }
                }}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select a vehicle to pre-fill license plate and VIN</option>
                {uniqueVehicles.map((vehicle, index) => (
                  <option key={index} value={vehicle.licensePlate + ' - ' + vehicle.vin}>{vehicle.licensePlate} - {vehicle.vin}</option>
                ))}
              </select>
            </div>
            {showDropdown && (
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Previously Added Parts for this Vehicle:</label>
                <select
                  onChange={(e) => {
                    const selectedPart = vehicleParts.find(part => part.id.toString() === e.target.value)
                    if (selectedPart) selectPart(selectedPart)
                  }}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Select a part to pre-fill</option>
                  {vehicleParts.map(part => (
                    <option key={part.id} value={part.id}>{part.name} - {part.partNumber}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button type="submit" className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Add Part
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Search Parts</h2>
        <input
          type="text"
          placeholder="Search by name, part number, description, license plate, or VIN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Current Auto Parts</h2>
        {searchTerm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParts.map((part) => (
              <div key={part.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-bold">{part.name}</h3>
                <p className="text-gray-600">Part #: {part.partNumber}</p>
                <p>{part.description}</p>
                <p>Quantity: {part.quantity}</p>
                <p>Price: ${part.price?.toFixed(2)}</p>
                {part.photo && <img src={part.photo} alt={part.name} className="w-full h-32 object-cover mt-2 rounded" />}
                {part.licensePlate && <p>License Plate: {part.licensePlate}</p>}
                {part.vin && <p>VIN: {part.vin}</p>}
                <button
                  onClick={() => deletePart(part.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Enter a search term to view parts.</p>
        )}
      </div>
    </div>
  )
}
