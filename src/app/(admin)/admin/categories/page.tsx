'use client'

import React, { useState } from 'react'
import { initialAdminCategories, AdminCategory } from '@/lib/mockAdminData'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(initialAdminCategories)
  const [newCatName, setNewCatName] = useState('')

  const handleAddCat = () => {
    if (!newCatName.trim()) return
    const newC: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      subcategories: ['Umumiy mutaxassisliklar']
    }
    setCategories([...categories, newC])
    setNewCatName('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            🗂️ Kategoriyalar va Mutaxassisliklar
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Vakansiyalar hamda rezumelar uchun daraxtsimon (Tree) katalog.
          </p>
        </div>
      </div>

      {/* Add Input */}
      <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="Yangi bosh kategoriya nomi..."
          value={newCatName}
          onChange={e => setNewCatName(e.target.value)}
          style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        />
        <button
          onClick={handleAddCat}
          style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', backgroundColor: '#dc2626', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
        >
          + Kategoriya qo'shish
        </button>
      </div>

      {/* Categories Tree List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a' }}>📁 {cat.name}</div>
              <button onClick={() => alert(`Subkategoriya qo'shish (${cat.name})`)} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                + Subkategoriya qo'shish
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {cat.subcategories.map(sub => (
                <span key={sub} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.85rem', padding: '0.3rem 0.75rem', borderRadius: '8px', fontWeight: 600 }}>
                  🔹 {sub}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
