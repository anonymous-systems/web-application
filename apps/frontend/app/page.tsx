import { CompanyInformation } from '@workspace/ui/lib/company-information'

export default function HomePage() {
  const { name } = CompanyInformation

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-bold">{name}</h1>
        <p className='text-2xl text-gray-500 dark:text-gray-400 font-semibold mt-4'>Frontend Coming soon...</p>
      </div>
    </div>
  )
}
