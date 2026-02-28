'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AutoPart {
  id: number
  name: string
  make: string
  partNumber?: string
  description?: string
  quantity: number
  price?: number
  photo?: string
  licensePlate?: string
  vin?: string
  purchaseLocation?: string
  desiredStockLevel: number
  zone?: string
  dateOfEntry: string
  lastUpdated: string
  lastStockUpdate?: string
}

export default function AutoParts() {
  const [parts, setParts] = useState<AutoPart[]>([])
  const [newPart, setNewPart] = useState({ 
    name: '', 
    make: '', 
    partNumber: '', 
    description: '', 
    quantity: 0, 
    price: 0, 
    photo: '', 
    licensePlate: '', 
    vin: '',
    purchaseLocation: '',
    desiredStockLevel: 0,
    zone: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredParts, setFilteredParts] = useState<AutoPart[]>([])
  const [vehicleParts, setVehicleParts] = useState<AutoPart[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [uniqueVehicles, setUniqueVehicles] = useState<{licensePlate: string, vin: string}[]>([])
  const [uniqueMakes, setUniqueMakes] = useState<string[]>([])
  const [uniqueZones, setUniqueZones] = useState<string[]>([])
  const [editingPart, setEditingPart] = useState<AutoPart | null>(null)
  const [alertPartId, setAlertPartId] = useState<number | null>(null)

  const warehouseZones = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3']

  useEffect(() => {
    setParts([
      { 
        id: 1, 
        name: 'Brake Pad', 
        make: 'Bosch', 
        partNumber: 'BP001', 
        description: 'Front brake pads', 
        quantity: 50, 
        price: 25.99, 
        purchaseLocation: 'AutoZone',
        desiredStockLevel: 30,
        zone: 'A1',
        dateOfEntry: '2023-01-01', 
        lastUpdated: '2023-01-01',
        lastStockUpdate: '2023-01-15'
      },
      { 
        id: 2, 
        name: 'Oil Filter', 
        make: 'Fram', 
        partNumber: 'OF002', 
        description: 'Engine oil filter', 
        quantity: 15, 
        price: 8.50,
        purchaseLocation: "O'Reilly Auto Parts",
        desiredStockLevel: 20,
        zone: 'B2',
        dateOfEntry: '2023-01-02', 
        lastUpdated: '2023-01-02',
        lastStockUpdate: '2023-01-10'
      },
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
    const makes = parts
      .filter(part => part.make)
      .map(part => part.make)
      .filter((make, index, self) => self.indexOf(make) === index)
    setUniqueMakes(makes)
  }, [parts])

  useEffect(() => {
    const zones = parts
      .filter(part => part.zone)
      .map(part => part.zone!)
      .filter((zone, index, self) => self.indexOf(zone) === index)
    setUniqueZones(zones)
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
        (part.make && part.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.partNumber && part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.description && part.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.licensePlate && part.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.vin && part.vin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.purchaseLocation && part.purchaseLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (part.zone && part.zone.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredParts(filtered)
    } else {
      setFilteredParts([])
    }
  }, [searchTerm, parts])

  useEffect(() => {
    if (editingPart) {
      setNewPart({
        name: editingPart.name,
        make: editingPart.make,
        partNumber: editingPart.partNumber || '',
        description: editingPart.description || '',
        quantity: editingPart.quantity,
        price: editingPart.price || 0,
        photo: editingPart.photo || '',
        licensePlate: editingPart.licensePlate || '',
        vin: editingPart.vin || '',
        purchaseLocation: editingPart.purchaseLocation || '',
        desiredStockLevel: editingPart.desiredStockLevel,
        zone: editingPart.zone || ''
      })
    }
  }, [editingPart])

  useEffect(() => {
    parts.forEach(part => {
      if (part.desiredStockLevel > 0 && part.quantity <= part.desiredStockLevel) {
        setAlertPartId(part.id)
      }
    })
  }, [parts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const currentTime = new Date().toISOString()
    
    if (editingPart) {
      const updatedPart: AutoPart = {
        ...editingPart,
        ...newPart,
        lastUpdated: currentTime,
        dateOfEntry: editingPart.dateOfEntry
      }
      setParts(parts.map(part => part.id === editingPart.id ? updatedPart : part))
      setEditingPart(null)
    } else {
      const part: AutoPart = {
        id: Date.now(),
        ...newPart,
        dateOfEntry: currentTime,
        lastUpdated: currentTime,
        lastStockUpdate: currentTime
      }
      setParts([...parts, part])
    }
    setNewPart({ 
      name: '', 
      make: '', 
      partNumber: '', 
      description: '', 
      quantity: 0, 
      price: 0, 
      photo: '', 
      licensePlate: '', 
      vin: '',
      purchaseLocation: '',
      desiredStockLevel: 0,
      zone: ''
    })
  }

  const deletePart = (id: number) => {
    setParts(parts.filter(part => part.id !== id))
  }

  const addStock = (id: number) => {
    const quantityToAdd = parseInt(prompt('Enter quantity to add:', '1') || '0')
    if (quantityToAdd > 0) {
      const currentTime = new Date().toISOString()
      setParts(parts.map(part =>
        part.id === id
          ? { 
              ...part, 
              quantity: part.quantity + quantityToAdd, 
              lastUpdated: currentTime,
              lastStockUpdate: currentTime
            }
          : part
      ))
    }
  }

  const removeStock = (id: number) => {
    const quantityToRemove = parseInt(prompt('Enter quantity to remove:', '1') || '0')
    if (quantityToRemove > 0) {
      const currentTime = new Date().toISOString()
      setParts(parts.map(part =>
        part.id === id
          ? { 
              ...part, 
              quantity: Math.max(0, part.quantity - quantityToRemove),
              lastUpdated: currentTime,
              lastStockUpdate: currentTime
            }
          : part
      ))
    }
  }

  const selectPart = (part: AutoPart) => {
    setNewPart({
      name: part.name,
      make: part.make,
      partNumber: part.partNumber || '',
      description: part.description || '',
      quantity: part.quantity,
      price: part.price || 0,
      photo: part.photo || '',
      licensePlate: part.licensePlate || '',
      vin: part.vin || '',
      purchaseLocation: part.purchaseLocation || '',
      desiredStockLevel: part.desiredStockLevel,
      zone: part.zone || ''
    })
    setShowDropdown(false)
  }

  const getStockStatus = (part: AutoPart) => {
    if (part.desiredStockLevel === 0) return null
    
    const percentage = (part.quantity / part.desiredStockLevel) * 100
    
    if (part.quantity === 0) {
      return { status: 'out', color: 'bg-red-100 border-red-500', text: 'text-red-700' }
    } else if (percentage <= 50) {
      return { status: 'low', color: 'bg-yellow-100 border-yellow-500', text: 'text-yellow-700' }
    } else if (percentage >= 100) {
      return { status: 'over', color: 'bg-green-100 border-green-500', text: 'text-green-700' }
    } else {
      return { status: 'normal', color: 'bg-blue-100 border-blue-500', text: 'text-blue-700' }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const renderPartCard = (part: AutoPart) => {
    const stockStatus = getStockStatus(part)
    return (
      <div key={part.id} className={`bg-white p-4 rounded-lg shadow-md ${stockStatus?.color || ''}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{part.name}</h3>
          {part.zone && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-semibold">
              Zone: {part.zone}
            </span>
          )}
        </div>
        <p className="text-gray-600">Make: {part.make}</p>
        <p className="text-gray-600">Part #: {part.partNumber}</p>
        <p>{part.description}</p>
        <div className="mt-2">
          <p className="font-semibold">Quantity: {part.quantity}</p>
          {part.desiredStockLevel > 0 && (
            <p className="text-sm text-gray-600">Desired Level: {part.desiredStockLevel}</p>
          )}
          {stockStatus && (
            <p className={`text-sm font-semibold ${stockStatus.text}`}>
              Status: {stockStatus.status === 'out' ? 'OUT OF STOCK' : 
                       stockStatus.status === 'low' ? 'LOW STOCK' :
                       stockStatus.status === 'over' ? 'OVERSTOCKED' : 'Normal'}
            </p>
          )}
        </div>
        <p className="text-green-600 font-semibold">Price: ${part.price?.toFixed(2)}</p>
        {part.purchaseLocation && (
          <p className="text-gray-600">Purchase Location: {part.purchaseLocation}</p>
        )}
        {part.licensePlate && <p className="text-gray-600">License Plate: {part.licensePlate}</p>}
        {part.vin && <p className="text-gray-600">VIN: {part.vin}</p>}
        
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">Date of Entry: {formatDate(part.dateOfEntry)}</p>
          <p className="text-xs text-gray-500">Last Updated: {formatDate(part.lastUpdated)}</p>
          {part.lastStockUpdate && (
            <p className="text-xs text-gray-500">Last Stock Update: {formatDate(part.lastStockUpdate)}</p>
          )}
        </div>
        
        {part.photo && <img src={part.photo} alt={part.name} className="w-full h-32 object-cover mt-2 rounded" />}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => addStock(part.id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Add Stock
          </button>
          <button
            onClick={() => removeStock(part.id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Remove Stock
          </button>
          <button
            onClick={() => setEditingPart(part)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => deletePart(part.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Auto Parts Inventory</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Back to Home
        </Link>
      </div>

      {alertPartId && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
          <p className="font-bold">Stock Alert!</p>
          <p>One or more parts have reached or fallen below their desired stock level. Check the inventory below.</p>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{editingPart ? 'Edit Auto Part' : 'Add New Auto Part'}</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
              <input
                type="text"
                value={newPart.name}
                onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input
                type="text"
                value={newPart.make}
                onChange={(e) => setNewPart({...newPart, make: e.target.value})}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                value={newPart.quantity}
                onChange={(e) => setNewPart({...newPart, quantity: parseInt(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newPart.price}
                onChange={(e) => setNewPart({...newPart, price: parseFloat(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Location</label>
              <input
                type="text"
                value={newPart.purchaseLocation}
                onChange={(e) => setNewPart({...newPart, purchaseLocation: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                placeholder="e.g., AutoZone, O'Reilly, Amazon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desired Stock Level</label>
              <input
                type="number"
                value={newPart.desiredStockLevel}
                onChange={(e) => setNewPart({...newPart, desiredStockLevel: parseInt(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
                placeholder="Alert when stock falls below this"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Zone</label>
              <select
                value={newPart.zone}
                onChange={(e) => setNewPart({...newPart, zone: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select a zone</option>
                {warehouseZones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
                {uniqueZones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
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
            {editingPart ? 'Update Part' : 'Add Part'}
          </button>
          {editingPart && (
            <button
              type="button"
              onClick={() => {
                setEditingPart(null)
                setNewPart({ 
                  name: '', 
                  make: '', 
                  partNumber: '', 
                  description: '', 
                  quantity: 0, 
                  price: 0, 
                  photo: '', 
                  licensePlate: '', 
                  vin: '',
                  purchaseLocation: '',
                  desiredStockLevel: 0,
                  zone: ''
                })
              }}
              className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Search Parts</h2>
        <input
          type="text"
          placeholder="Search by name, make, part number, description, license plate, VIN, purchase location, or zone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {searchTerm && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results ({filteredParts.length} parts found)</h2>
          {filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredParts.map(renderPartCard)}
            </div>
          ) : (
            <p className="text-gray-600">No parts found matching "{searchTerm}"</p>
          )}
        </div>
      )}
    </div>
  )
}
