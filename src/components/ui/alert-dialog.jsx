"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { PrimaryButton, OutlineButton, WarningButton } from "@/components/ui/button"

function AlertDialog({
  ...props
}) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}) {
  return (<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />);
}

function AlertDialogPortal({
  ...props
}) {
  return (<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />);
}

function AlertDialogOverlay({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        className
      )}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      {...props} />
  );
}

function AlertDialogContent({
  className,
  ...props
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-6 shadow-2xl duration-200 sm:max-w-lg p-6",
          className
        )}
        style={{ borderRadius: '16px' }}
        {...props} />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props} />
  );
}

function AlertDialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3", className)}
      {...props} />
  );
}

function AlertDialogTitle({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-2xl font-bold", className)}
      style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
      {...props} />
  );
}

function AlertDialogDescription({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-base", className)}
      style={{ color: '#015023', opacity: 0.8, fontFamily: 'Urbanist, sans-serif' }}
      {...props} />
  );
}

function AlertDialogAction({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <PrimaryButton className={className} {...props} />
    </AlertDialogPrimitive.Action>
  );
}

function AlertDialogCancel({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <OutlineButton className={className} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}

function AlertConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Konfirmasikan"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description || "Apakah Anda yakin ingin melanjutkan?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <OutlineButton>{cancelText || "Batal"}</OutlineButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <WarningButton onClick={onConfirm}>{confirmText || "Lanjutkan"}</WarningButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertErrorDialog({
  open,
  onOpenChange,
  title,
  description,
  closeText,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><span className='text-red-500'>{title || "Error"}</span></AlertDialogTitle>
          <AlertDialogDescription>
            {description || "Terjadi kesalahan. Silakan coba lagi."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <OutlineButton>{closeText || "Tutup"}</OutlineButton>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertSuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  closeText,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><span className='text-green-500'>{title || "Success"}</span></AlertDialogTitle>
          <AlertDialogDescription>
            {description || "Operasi berhasil diselesaikan."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <OutlineButton>{closeText || "Tutup"}</OutlineButton>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertInfoDialog({
  open,
  onOpenChange,
  title,
  description,
  closeText,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><span className='text-yellow-500'>{title || "Info"}</span></AlertDialogTitle>
          <AlertDialogDescription>
            {description || "Informasi penting untuk diketahui."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <OutlineButton>{closeText || "Tutup"}</OutlineButton>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function AlertWarningDialog({
  open,
  onOpenChange,
  title,
  description,
  closeText,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><span className='text-yellow-500'>{title || "Info"}</span></AlertDialogTitle>
          <AlertDialogDescription>
            <span style={{ color: '#BE0414', fontWeight: '600' }}>
              {description || "Informasi penting untuk diketahui."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <OutlineButton>{closeText || "Tutup"}</OutlineButton>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertConfirmationDialog,
  AlertErrorDialog,
  AlertSuccessDialog,
  AlertInfoDialog,
  AlertWarningDialog,
}
