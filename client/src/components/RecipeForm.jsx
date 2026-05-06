import { useForm, useFieldArray } from 'react-hook-form'
import { UNITS } from '../constants/units'
import './RecipeForm.css'

export default function RecipeForm({ onSubmit, defaultValues, onCancel }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues ?? {
      title:       '',
      description: '',
      category:    'desayuno',
      cookTime:    '',
      servings:    '',
      ingredients: [{ name: '', amount: '', unit: 'g' }],
      steps:       [''],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' })

  return (
    <form
      className="recipe-form"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="form-group">
        <label className="form-label">Título *</label>
        <input
          className="form-input"
          {...register('title', { required: 'El título es obligatorio' })}
          placeholder="Nombre de la receta"
        />
        {errors.title && (
          <span className="form-error">{errors.title.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-textarea"
          {...register('description')}
          placeholder="Descripción breve de la receta"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select className="form-select" {...register('category')}>
            {['desayuno', 'comida', 'cena', 'postre', 'snack', 'bebida'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tiempo (min)</label>
          <input
            className="form-input"
            {...register('cookTime')}
            type="number"
            placeholder="30"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Porciones</label>
        <input
          className="form-input"
          {...register('servings')}
          type="number"
          placeholder="4"
        />
      </div>

      <div className="form-group">
        <p className="form-section-title">Ingredientes</p>
        <div className="ingredient-list">
          {fields.map((field, i) => (
            <div key={field.id} className="ingredient-row">
              <input
                className="form-input"
                {...register(`ingredients.${i}.name`)}
                placeholder="Ingrediente"
              />
              <input
                className="form-input"
                {...register(`ingredients.${i}.amount`)}
                type="number"
                placeholder="Cantidad"
              />
              <select className="form-select" {...register(`ingredients.${i}.unit`)}>
                {UNITS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <button
                type="button"
                className="ingredient-remove"
                onClick={() => remove(i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-add-ingredient"
          onClick={() => append({ name: '', amount: '', unit: 'g' })}
        >
          + Agregar ingrediente
        </button>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          Guardar receta
        </button>
      </div>

    </form>
  )
}