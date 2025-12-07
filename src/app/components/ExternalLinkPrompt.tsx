'use client'

interface ExternalLinkPromptProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  url: string
}

export default function ExternalLinkPrompt({
  open,
  onClose,
  onConfirm,
  url,
}: ExternalLinkPromptProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-4">
        <h3 className="text-lg font-semibold mb-2">Leaving Site</h3>
        <p className="text-sm text-gray-600 mb-2">
          You are about to visit an external HackerNews profile:
        </p>
        <p className="text-sm text-blue-600 mb-4 break-all">{url}</p>
        <p className="text-sm text-gray-500 mb-4">Do you want to continue?</p>
        <div className="flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
            onClick={onConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
