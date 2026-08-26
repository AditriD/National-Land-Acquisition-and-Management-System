//doc upload
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DOC_TYPES = ['Ownership Proof', 'Survey Settlement', 'Notification Copy']

export function DocumentUploadForm({ parcelId }: { parcelId: string }) {
  const router = useRouter()
  const [docType, setDocType] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !docType) {
      setError('Select a document type and file')
      return
    }
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('docType', docType)
    formData.append('parcelId', parcelId)

    const res = await fetch('/api/documents/upload', { method: 'POST', body: formData })
    setUploading(false)

    if (!res.ok) {
      setError('Upload failed')
      return
    }
    setDocType('')
    setFile(null)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border rounded-lg p-3 mt-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <select
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">Select document type</option>
        {DOC_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm"
      />
      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm w-fit"
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </form>
  )
}