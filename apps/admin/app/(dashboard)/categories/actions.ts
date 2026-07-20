'use server'

import { revalidatePath } from 'next/cache'
import { CollectionReference, FieldValue, getFirestore } from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { getAdminCaller } from '@/lib/admin-caller'
import { slugify, validateCategoryInput } from '@/lib/category'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'

const NOT_ADMIN = 'You must be an admin to manage categories.'
const UNEXPECTED = 'Something went wrong. Please try again.'

const categories = (): CollectionReference =>
  getFirestore(getFirebaseAdminApp()).collection('categories')

/** Slugs identify a category publicly, so they must stay unique. */
const isSlugTaken = async (slug: string, excludeId?: string): Promise<boolean> => {
  const snapshot = await categories().where('slug', '==', slug).get()

  return snapshot.docs.some((doc) => doc.id !== excludeId)
}

export const createCategory = async (
  name: string,
  description: string
): Promise<ActionResult> => {
  const caller = await getAdminCaller()
  if (!caller?.isAdmin) return { ok: false, error: NOT_ADMIN }

  const validation = validateCategoryInput({ name, description })
  if (!validation.valid) return { ok: false, error: validation.error }

  const slug = slugify(name)

  try {
    if (await isSlugTaken(slug)) {
      return { ok: false, error: 'A category with a similar name already exists.' }
    }

    await categories().add({
      name: name.trim(),
      slug,
      description: description.trim() || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidatePath(AppRoutes.categories)
    return { ok: true }
  } catch (error) {
    console.error('Failed to create category', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const updateCategory = async (
  id: string,
  name: string,
  description: string
): Promise<ActionResult> => {
  const caller = await getAdminCaller()
  if (!caller?.isAdmin) return { ok: false, error: NOT_ADMIN }

  const validation = validateCategoryInput({ name, description })
  if (!validation.valid) return { ok: false, error: validation.error }

  const slug = slugify(name)

  try {
    if (await isSlugTaken(slug, id)) {
      return { ok: false, error: 'A category with a similar name already exists.' }
    }

    await categories().doc(id).update({
      name: name.trim(),
      slug,
      description: description.trim() || null,
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidatePath(AppRoutes.categories)
    return { ok: true }
  } catch (error) {
    console.error('Failed to update category', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const deleteCategory = async (id: string): Promise<ActionResult> => {
  const caller = await getAdminCaller()
  if (!caller?.isAdmin) return { ok: false, error: NOT_ADMIN }

  try {
    await categories().doc(id).delete()

    revalidatePath(AppRoutes.categories)
    return { ok: true }
  } catch (error) {
    console.error('Failed to delete category', error)
    return { ok: false, error: UNEXPECTED }
  }
}
