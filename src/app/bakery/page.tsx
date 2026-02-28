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
  image?: string
  weight?: number
}

export default function Bakery() {
  const [items, setItems] = useState<BakeryItem[]>([])
  const [newItem, setNewItem] = useState({ itemNumber: '', name: '', type: 'machinery', description: '', quantity: 0, image: '', weight: 0 })
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
    setNewItem({ itemNumber: '', name: '', type: 'machinery', description: '', quantity: 0, image: '', weight: 0 })
  }

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setNewItem({...newItem, image: url})
    }
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Number</label>
              <input
                type="text"
                placeholder="Enter item number"
                value={newItem.itemNumber}
                onChange={(e) => setNewItem({...newItem, itemNumber: e.target.value})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="machinery">Machinery</option>
                <option value="equipment">Equipment</option>
                <option value="supplies">Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="Enter description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            {newItem.type === 'supplies' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="Enter weight in kg"
                  value={newItem.weight}
                  onChange={(e) => setNewItem({...newItem, weight: parseFloat(e.target.value)})}
                  className="border rounded px-3 py-2 w-full"
                  step="0.01"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
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
        {searchQuery.trim() !== '' && (
          filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />}
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
          ) : (
            <p className="text-gray-500">No records found.</p>
          )
        )}
      </div>
    </div>
  )
}
