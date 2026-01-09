'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  vin: string
}

interface Maintenance {
  id: number
  vehicleId: number
  type: string
  description?: string
  date: string
  nextDue?: string
  cost?: number
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
    cost: 0
  })

  useEffect(() => {
    // TODO: Fetch vehicles and maintenances from API
    setVehicles([
      { id: 1, make: 'Toyota', model: 'Camry', year: 2020, vin: '1HGBH41JXMN109186' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2019, vin: '2HGFC2F59KH123456' },
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
    setNewMaintenance({ type: '', description: '', date: '', nextDue: '', cost: 0 })
  }

  const filteredMaintenances = maintenances.filter(m => selectedVehicle ? m.vehicleId === selectedVehicle : true)

  return (
    <div className="container mx-auto px-4 py-8">
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
              {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Maintenance Record</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Maintenance Type"
              value={newMaintenance.type}
              onChange={(e) => setNewMaintenance({...newMaintenance, type: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newMaintenance.description}
              onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              placeholder="Date"
              value={newMaintenance.date}
              onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="date"
              placeholder="Next Due Date"
              value={newMaintenance.nextDue}
              onChange={(e) => setNewMaintenance({...newMaintenance, nextDue: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cost"
              value={newMaintenance.cost}
              onChange={(e) => setNewMaintenance({...newMaintenance, cost: parseFloat(e.target.value)})}
              className="border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" disabled={!selectedVehicle}>
            Add Maintenance
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Maintenance History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaintenances.map((maintenance) => {
            const vehicle = vehicles.find(v => v.id === maintenance.vehicleId)
            return (
              <div key={maintenance.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-bold">{maintenance.type}</h3>
                <p className="text-gray-600">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
                <p>{maintenance.description}</p>
                <p>Date: {maintenance.date}</p>
                {maintenance.nextDue && <p>Next Due: {maintenance.nextDue}</p>}
                <p>Cost: ${maintenance.cost?.toFixed(2)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
