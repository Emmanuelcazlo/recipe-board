import { useState } from 'react'
import { useRecipes } from './hooks/useRecipes'
import RecipeCard from './components/RecipeCard'
import RecipeForm from './components/RecipeForm'
import RecipeDetail from './components/RecipeDetail'
import './index.css'
import './App.css'

const CATEGORIES = ['todas', 'desayuno', 'comida', 'cena', 'postre', 'snack', 'bebida']

// modal puede ser: null | 'detail' | 'form'
export default function App() {
  const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } = useRecipes()

  const [activeCategory, setActiveCategory] = useState('todas')
  const [search, setSearch]                 = useState('')
  const [modal, setModal]                   = useState(null)   // 'detail' | 'form' | null
  const [selected, setSelected]             = useState(null)   // receta activa

  const filtered = recipes.filter(r => {
    const matchCat    = activeCategory === 'todas' || r.category === activeCategory
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Click en la card → detalle (solo lectura)
  function openDetail(recipe) {
    setSelected(recipe)
    setModal('detail')
  }

  // Botón "+ Nueva receta"
  function openCreate() {
    setSelected(null)
    setModal('form')
  }

  // Botón ✏️ de la card o del detalle → formulario de edición
  function openEdit(recipe) {
    setSelected(recipe)
    setModal('form')
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
  }

  async function handleSave(data) {
    try {
      const cleaned = {
        ...data,
        cookTime:    Number(data.cookTime)  || 0,
        servings:    Number(data.servings)  || 0,
        ingredients: data.ingredients.map(ing => ({
          ...ing,
          amount: Number(ing.amount) || 0,
        })),
      }
      if (selected?._id) {
        await updateRecipe(selected._id, cleaned)
      } else {
        await createRecipe(cleaned)
      }
      closeModal()
    } catch {
      alert('Error al guardar la receta. Intenta de nuevo.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRecipe(id)
      if (selected?._id === id) closeModal()
    } catch {
      alert('Error al eliminar la receta.')
    }
  }

  const modalTitle = modal === 'form'
    ? (selected ? 'Editar receta' : 'Nueva receta')
    : selected?.title ?? ''

  return (
    <div className="app-page">

      {/* Header */}
      <header className="app-header">
        <div className="app-header-left">
          <div>
            <h1 className="app-title">Recetario</h1>
            <p className="app-subtitle">{recipes.length} recetas guardadas</p>
          </div>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Nueva receta
        </button>
      </header>

      {/* Toolbar */}
      <div className="app-toolbar">
        <div className="app-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          className="app-search"
          placeholder="Buscar receta..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Estado: cargando */}
      {loading && (
        <div className="app-centered">
          <p>Cargando recetas...</p>
        </div>
      )}

      {/* Estado: error */}
      {!loading && error && (
        <div className="app-centered">
          <p style={{ color: 'var(--color-danger)' }}>{error}</p>
          <button className="btn-secondary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      )}

      {/* Estado: vacío */}
      {!loading && !error && filtered.length === 0 && (
        <div className="app-centered">
          <p>
            {search || activeCategory !== 'todas'
              ? 'No hay recetas con ese filtro.'
              : 'Aún no tienes recetas. ¡Agrega la primera!'}
          </p>
          {!search && activeCategory === 'todas' && (
            <button className="btn-secondary" onClick={openCreate}>
              + Nueva receta
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="recipe-grid">
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onClick={() => openDetail(recipe)}
              onEdit={() => openEdit(recipe)}
              onDelete={() => handleDelete(recipe._id)}
            />
          ))}
          <button className="add-recipe-card" onClick={openCreate}>
            <span className="add-recipe-icon">+</span>
            <span className="add-recipe-label">Agregar receta</span>
          </button>
        </div>
      )}

      {/* Modal — detalle o formulario */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalTitle}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {modal === 'detail' && selected && (
                <RecipeDetail
                  recipe={selected}
                  onEdit={() => openEdit(selected)}
                />
              )}
              {modal === 'form' && (
                <RecipeForm
                  defaultValues={selected}
                  onSubmit={handleSave}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}