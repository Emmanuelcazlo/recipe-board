import { useState } from 'react'
import './RecipeCard.css'

const CATEGORY_EMOJI = {
  desayuno: '🍳',
  comida:   '🍲',
  cena:     '🍝',
  postre:   '🍮',
  snack:    '🫔',
  bebida:   '🍹',
}

const CATEGORY_BG = {
  desayuno: '#FAEEDA',
  comida:   '#E1F5EE',
  cena:     '#EEEDFE',
  postre:   '#FBEAF0',
  snack:    '#FAECE7',
  bebida:   '#E6F1FB',
}

export default function RecipeCard({ recipe, onClick, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete()
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  function handleEdit(e) {
    e.stopPropagation()
    onEdit()
  }

  const bg = CATEGORY_BG[recipe.category] ?? '#F1EFE8'

  return (
    <div className="recipe-card" onClick={onClick}>

      {/* Imagen / emoji */}
      <div className="recipe-card-img" style={{ background: bg }}>
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} />
          : CATEGORY_EMOJI[recipe.category] ?? '🍽️'
        }
      </div>

      {/* Cuerpo */}
      <div className="recipe-card-body">
        <div className="recipe-card-top">
          <h3 className="recipe-card-title">{recipe.title}</h3>
          {recipe.category && (
            <span className={`recipe-badge ${recipe.category}`}>
              {recipe.category}
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="recipe-card-desc">{recipe.description}</p>
        )}

        <div className="recipe-card-meta">
          {recipe.cookTime > 0 && (
            <span className="meta-item">🕐 {recipe.cookTime} min</span>
          )}
          {recipe.servings > 0 && (
            <span className="meta-item">👥 {recipe.servings} porc.</span>
          )}
          {recipe.ingredients?.length > 0 && (
            <span className="meta-item">🧺 {recipe.ingredients.length} ingr.</span>
          )}
        </div>
      </div>

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="recipe-card-footer">
          {recipe.tags.map(tag => (
            <span key={tag} className="recipe-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="recipe-card-actions">
        <button className="action-btn" onClick={handleEdit} title="Editar">
          ✏️
        </button>
        <button
          className={`action-btn ${confirmDelete ? 'danger' : ''}`}
          onClick={handleDelete}
          title={confirmDelete ? 'Confirmar eliminación' : 'Eliminar'}
        >
          {confirmDelete ? '¿Seguro?' : '🗑️'}
        </button>
      </div>

    </div>
  )
}