'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
}

interface Maintenance {
  id: number
  vehicleId: number
  type: string
  description?: string
  date: string
  nextDue?: string
  cost?: number
  notes?: string
}

export default function Maintenance() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)
  const [newMaintenance, setNewMaintenance] = useState({
    type: '',
    description: '',
    date: '',
    nextDue: '',
    cost: 0,
    notes: ''
  })
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 0,
    vin: '',
    licensePlate: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // TODO: Fetch vehicles and maintenances from API
    setVehicles([
      { id: 1, make: 'Toyota', model: 'Camry', year: 2020, vin: '1HGBH41JXMN109186', licensePlate: 'ABC123' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2019, vin: '2HGFC2F59KH123456', licensePlate: 'XYZ789' },
    ])
    setMaintenances([
      { id: 1, vehicleId: 1, type: 'Oil Change', description: 'Regular oil change', date: '2023-01-15', nextDue: '2023-04-15', cost: 45.99 },
      { id: 2, vehicleId: 1, type: 'Tire Rotation', description: 'Front to back tire rotation', date: '2023-02-01', nextDue: '2023-08-01', cost: 25.00 },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicle) return
    // TODO: Add maintenance via API
    const maintenance: Maintenance = {
      id: Date.now(),
      vehicleId: selectedVehicle,
      ...newMaintenance
    }
    setMaintenances([...maintenances, maintenance])
    setNewMaintenance({ type: '', description: '', date: '', nextDue: '', cost: 0, notes: '' })
  }

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const vehicle: Vehicle = {
      id: Date.now(),
      ...newVehicle
    }
    setVehicles([...vehicles, vehicle])
    setNewVehicle({ make: '', model: '', year: 0, vin: '', licensePlate: '' })
  }

  const deleteVehicle = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id))
    setMaintenances(maintenances.filter(m => m.vehicleId !== id))
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm !== '' && (
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return matchesSearch
  })

  const filteredMaintenances = maintenances.filter(m => {
    const vehicle = vehicles.find(v => v.id === m.vehicleId)
    const matchesVehicle = selectedVehicle ? m.vehicleId === selectedVehicle : true
    const matchesSearch = searchTerm !== '' && (
      m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.date.includes(searchTerm) ||
      m.nextDue?.includes(searchTerm) ||
      m.cost?.toString().includes(searchTerm) ||
      vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.year.toString().includes(searchTerm) ||
      vehicle?.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return matchesVehicle && matchesSearch
  })

  const upcomingMaintenances = maintenances
    .filter(m => m.nextDue && new Date(m.nextDue) > new Date())
    .sort((a, b) => new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime())

  const filteredUpcomingMaintenances = upcomingMaintenances.filter(m => {
    const vehicle = vehicles.find(v => v.id === m.vehicleId)
    const matchesSearch = searchTerm !== '' && (
      m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.date.includes(searchTerm) ||
      m.nextDue?.includes(searchTerm) ||
      m.cost?.toString().includes(searchTerm) ||
      vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.year.toString().includes(searchTerm) ||
      vehicle?.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return searchTerm === '' || matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-block mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-8">Vehicle Maintenance Schedules</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Vehicle</h2>
        <select
          value={selectedVehicle || ''}
          onChange={(e) => setSelectedVehicle(e.target.value ? parseInt(e.target.value) : null)}
          className="border rounded px-3 py-2 mb-4"
        >
          <option value="">All Vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin} ({vehicle.licensePlate})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Vehicle</h2>
        <form onSubmit={handleVehicleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input
                type="text"
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={newVehicle.vin}
                onChange={(e) => setNewVehicle({...newVehicle, vin: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                value={newVehicle.licensePlate}
                onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Vehicle
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Manage Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <p>VIN: {vehicle.vin}</p>
                <p>License Plate: {vehicle.licensePlate}</p>
                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No vehicles found</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Maintenance Record</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
              <input
                type="text"
                value={newMaintenance.type}
                onChange={(e) => setNewMaintenance({...newMaintenance, type: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newMaintenance.description}
                onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newMaintenance.date}
                onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
              <input
                type="date"
                value={newMaintenance.nextDue}
                onChange={(e) => setNewMaintenance({...newMaintenance, nextDue: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input
                type="number"
                step="0.01"
                value={newMaintenance.cost}
                onChange={(e) => setNewMaintenance({...newMaintenance, cost: parseFloat(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newMaintenance.notes}
                onChange={(e) => setNewMaintenance({...newMaintenance, notes: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                rows={4}
                placeholder="Enter any additional notes about this maintenance..."
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" disabled={!selectedVehicle}>
            Add Maintenance
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Maintenance Schedules</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search upcoming maintenance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUpcomingMaintenances.length > 0 ? (
            filteredUpcomingMaintenances.map((maintenance) => {
              const vehicle = vehicles.find(v => v.id === maintenance.vehicleId)
              const daysUntilDue = Math.ceil((new Date(maintenance.nextDue!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div key={maintenance.id} className={`bg-white p-4 rounded-lg shadow-md ${daysUntilDue <= 7 ? 'border-l-4 border-red-500' : daysUntilDue <= 30 ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}`}>
                  <h3 className="font-bold">{maintenance.type}</h3>
                  <p className="text-gray-600">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
                  <p>{maintenance.description}</p>
                  <p>Last Service: {maintenance.date}</p>
                  <p className={`font-semibold ${daysUntilDue <= 7 ? 'text-red-600' : daysUntilDue <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    Next Due: {maintenance.nextDue} ({daysUntilDue} days)
                  </p>
                  <p>Estimated Cost: ${maintenance.cost?.toFixed(2)}</p>
                  {maintenance.notes && <p>Notes: {maintenance.notes}</p>}
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No upcoming maintenance scheduled</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Maintenance History</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search maintenance records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaintenances.length > 0 ? (
            filteredMaintenances.map((maintenance) => {
              const vehicle = vehicles.find(v => v.id === maintenance.vehicleId)
              return (
                <div key={maintenance.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold">{maintenance.type}</h3>
                  <p className="text-gray-600">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
                  <p>{maintenance.description}</p>
                  <p>Date: {maintenance.date}</p>
                  {maintenance.nextDue && <p>Next Due: {maintenance.nextDue}</p>}
                  <p>Cost: ${maintenance.cost?.toFixed(2)}</p>
                  {maintenance.notes && <p>Notes: {maintenance.notes}</p>}
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No record found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
