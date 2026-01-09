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
}

export default function AutoParts() {
  const [parts, setParts] = useState<AutoPart[]>([])
  const [newPart, setNewPart] = useState({ name: '', partNumber: '', description: '', quantity: 0, price: 0 })

  useEffect(() => {
    // TODO: Fetch parts from API
    setParts([
      { id: 1, name: 'Brake Pad', partNumber: 'BP001', description: 'Front brake pads', quantity: 50, price: 25.99 },
      { id: 2, name: 'Oil Filter', partNumber: 'OF002', description: 'Engine oil filter', quantity: 30, price: 8.50 },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add part via API
    const part: AutoPart = {
      id: Date.now(),
      ...newPart
    }
    setParts([...parts, part])
    setNewPart({ name: '', partNumber: '', description: '', quantity: 0, price: 0 })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Auto Parts Inventory</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Auto Part</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Part Name"
              value={newPart.name}
              onChange={(e) => setNewPart({...newPart, name: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Part Number"
              value={newPart.partNumber}
              onChange={(e) => setNewPart({...newPart, partNumber: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newPart.description}
              onChange={(e) => setNewPart({...newPart, description: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newPart.quantity}
              onChange={(e) => setNewPart({...newPart, quantity: parseInt(e.target.value)})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newPart.price}
              onChange={(e) => setNewPart({...newPart, price: parseFloat(e.target.value)})}
              className="border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Add Part
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Current Auto Parts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map((part) => (
            <div key={part.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{part.name}</h3>
              <p className="text-gray-600">Part #: {part.partNumber}</p>
              <p>{part.description}</p>
              <p>Quantity: {part.quantity}</p>
              <p>Price: ${part.price?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
