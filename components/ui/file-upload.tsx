'use client'

import * as React from 'react'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { formatFileSize } from '@/lib/utils/formatters'

import { FileUploadProps } from '@/types/ui'


export function FileUpload({
    accept = '.torrent',
    maxSize = 10 * 1024 * 1024, // 10MB default
    onFileSelect,
    selectedFile,
    error,
    className,
    disabled = false,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const [validationError, setValidationError] = React.useState<string | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const displayError = error || validationError

    const validateFile = (file: File): boolean => {
        setValidationError(null)

        // Check file type
        if (accept) {
            const acceptedTypes = accept.split(',').map((t) => t.trim())
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
            const isValidType = acceptedTypes.some(
                (type) =>
                    type === fileExtension ||
                    type === file.type ||
                    (type.endsWith('/*') && file.type.startsWith(type.replace('/*', '')))
            )
            if (!isValidType) {
                setValidationError(`Please upload a ${accept} file`)
                return false
            }
        }

        // Check file size
        if (maxSize && file.size > maxSize) {
            setValidationError(`File size must be less than ${formatFileSize(maxSize)}`)
            return false
        }

        return true
    }

    const handleFileChange = (file: File | null) => {
        if (file && validateFile(file)) {
            onFileSelect(file)
        } else if (!file) {
            setValidationError(null)
            onFileSelect(null)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (disabled) return

        const file = e.dataTransfer.files[0]
        if (file) {
            handleFileChange(file)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        handleFileChange(file)
    }

    const handleRemove = () => {
        handleFileChange(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className={cn('space-y-2', className)}>
            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50',
                        disabled && 'cursor-not-allowed opacity-50',
                        displayError && 'border-sage'
                    )}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Upload
                        className={cn(
                            'mb-4 h-12 w-12',
                            isDragging ? 'text-primary' : 'text-muted-foreground'
                        )}
                    />
                    <p className="mb-1 text-sm font-medium">
                        {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                    </p>
                    <p className="mb-4 text-xs text-muted-foreground">
                        or click to browse (max {formatFileSize(maxSize)})
                    </p>
                    <Button type="button" variant="outline" size="sm" disabled={disabled}>
                        Choose File
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                    </Button>
                </div>
            )}

            {displayError && (
                <div className="flex items-center gap-2 text-sm text-sage">
                    <AlertCircle className="h-4 w-4" />
                    <span>{displayError}</span>
                </div>
            )}
        </div>
    )
}

