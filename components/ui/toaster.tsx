"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`${
              variant === 'destructive'
                ? 'border-red-300 bg-red-50 text-red-900'
                : 'border-green-300 bg-green-50 text-green-900'
            } border-l-2 py-2 px-3`}
          >
            <div className="flex items-center gap-2">
              {title && <ToastTitle className="text-sm font-medium">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="ml-2 self-center" />
          </Toast>
        )
      })}
      <ToastViewport className="!fixed !top-4 !right-4 !z-[100] !w-auto !bottom-auto !left-auto" />
    </ToastProvider>
  )
}
