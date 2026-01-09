'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BakeryItem {
  id: number
  itemNumber: string
  name: string
  type: string
  description?: string
  quantity: number
}

export default function Bakery() {
  const [items, setItems] = useState<BakeryItem[]>([])
  const [newItem, setNewItem] = useState({ itemNumber: '', name: '', type: 'machinery', description: '', quantity: 0 })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // TODO: Fetch items from API
    setItems([
      { id: 1, itemNumber: '001', name: 'Oven', type: 'machinery', description: 'Industrial baking oven', quantity: 2 },
      { id: 2, itemNumber: '002', name: 'Mixer', type: 'equipment', description: 'Dough mixer', quantity: 3 },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add item via API
    const item: BakeryItem = {
      id: Date.now(),
      ...newItem
    }
    setItems([...items, item])
    setNewItem({ itemNumber: '', name: '', type: 'machinery', description: '', quantity: 0 })
  }

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.itemNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bakery Stock Inventory</h1>
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 inline-block">
        Back to Homepage
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Bakery Item</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Item Number"
              value={newItem.itemNumber}
              onChange={(e) => setNewItem({...newItem, itemNumber: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({...newItem, type: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="machinery">Machinery</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Add Item
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Current Bakery Stock</h2>
        <input
          type="text"
          placeholder="Search items by name, type, or item number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600">Item Number: {item.itemNumber}</p>
              <p className="text-gray-600">Type: {item.type}</p>
              <p>{item.description}</p>
              <p>Quantity: {item.quantity}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
