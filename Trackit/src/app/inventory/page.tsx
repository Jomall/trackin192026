'use client'

import { useState, useEffect } from 'react'

interface InventoryItem {
  id: number
  name: string
  description?: string
  quantity: number
  category: string
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 0, category: 'storeroom' })

  useEffect(() => {
    // TODO: Fetch items from API
    setItems([
      { id: 1, name: 'Item 1', description: 'Description 1', quantity: 10, category: 'storeroom' },
      { id: 2, name: 'Item 2', description: 'Description 2', quantity: 5, category: 'bakery' },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add item via API
    const item: InventoryItem = {
      id: Date.now(),
      ...newItem
    }
    setItems([...items, item])
    setNewItem({ name: '', description: '', quantity: 0, category: 'storeroom' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
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
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="storeroom">Storeroom</option>
              <option value="bakery">Bakery</option>
              <option value="auto">Auto Parts</option>
            </select>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Item
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Current Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Category: {item.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
