import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type React from "react" // Added import for React

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  if (!isOpen && !isClosing) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      <div className="relative bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

