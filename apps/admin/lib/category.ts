export const MAX_NAME_LENGTH = 60
export const MAX_DESCRIPTION_LENGTH = 200

/** Builds a URL-safe slug from a category name. */
export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export interface CategoryInput {
  name: string
  description?: string | null
}

export interface CategoryValidation {
  valid: boolean
  error?: string
}

/**
 * Validates category input before it reaches Firestore. Kept pure so both the
 * server action and its tests share exactly the same rules.
 */
export const validateCategoryInput = (input: CategoryInput): CategoryValidation => {
  const name = input.name?.trim() ?? ''

  if (name === '') {
    return { valid: false, error: 'Name is required.' }
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` }
  }
  if (slugify(name) === '') {
    return { valid: false, error: 'Name must contain at least one letter or number.' }
  }

  const description = input.description?.trim() ?? ''
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
    }
  }

  return { valid: true }
}
