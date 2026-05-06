import './RecipeDetail.css'

const CATEGORY_BG = {
  desayuno: '#FAEEDA',
  comida:   '#E1F5EE',
  cena:     '#EEEDFE',
  postre:   '#FBEAF0',
  snack:    '#FAECE7',
  bebida:   '#E6F1FB',
}

export default function RecipeDetail({ recipe, onEdit }) {
  const bg = CATEGORY_BG[recipe.category] ?? '#F1EFE8'

  return (
    <div>

      {/* Título + badge + botón editar */}
      <div className="detail-header">
        <div className="detail-header-left">
          <h2 className="detail-title">{recipe.title}</h2>
          {recipe.category && (
            <span className={`detail-badge ${recipe.category}`}>
              {recipe.category}
            </span>
          )}
        </div>
        <button className="detail-edit-btn" onClick={onEdit}>
          ✏️ Editar
        </button>
      </div>

      <div className="detail-meta">
        {recipe.cookTime > 0 && (
          <div className="detail-meta-item">
            <span className="detail-meta-label">Tiempo</span>
            <span className="detail-meta-value">🕐 {recipe.cookTime} min</span>
          </div>
        )}
        {recipe.servings > 0 && (
          <div className="detail-meta-item">
            <span className="detail-meta-label">Porciones</span>
            <span className="detail-meta-value">👥 {recipe.servings}</span>
          </div>
        )}
        {recipe.ingredients?.length > 0 && (
          <div className="detail-meta-item">
            <span className="detail-meta-label">Ingredientes</span>
            <span className="detail-meta-value">🧺 {recipe.ingredients.length}</span>
          </div>
        )}
      </div>

      {recipe.description && (
        <p className="detail-description">{recipe.description}</p>
      )}

      {/* Ingredientes */}
      {recipe.ingredients?.length > 0 && (
        <div className="detail-section">
          <h3 className="detail-section-title">Ingredientes</h3>
          <div className="detail-ingredients">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="detail-ingredient">
                <span className="detail-ingredient-name">{ing.name}</span>
                <span className="detail-ingredient-amount">
                  {ing.amount > 0 ? `${ing.amount} ${ing.unit}` : ing.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pasos */}
      {recipe.steps?.filter(s => s).length > 0 && (
        <div className="detail-section">
          <h3 className="detail-section-title">Preparación</h3>
          <div className="detail-steps">
            {recipe.steps.filter(s => s).map((step, i) => (
              <div key={i} className="detail-step">
                <span className="detail-step-number">{i + 1}</span>
                <p className="detail-step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="detail-section">
          <h3 className="detail-section-title">Etiquetas</h3>
          <div className="detail-tags">
            {recipe.tags.map(tag => (
              <span key={tag} className="detail-tag">{tag}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}