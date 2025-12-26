'use client'

import { Button } from '@/components/ui/button'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/modal'
import { Loader2 } from 'lucide-react'
import type { Job } from '@/types/jobs'
import { useJobsStore } from '@/stores/jobsStore'

interface JobRefundModalProps {
    job: Job
    onConfirm: () => void
    loading?: boolean
}

export function JobRefundModal({ job, onConfirm, loading }: JobRefundModalProps) {
    const { showRefundModal, setShowRefundModal } = useJobsStore()

    return (
        <Modal open={showRefundModal} onOpenChange={setShowRefundModal}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Request Refund</ModalTitle>
                    <ModalDescription>
                        Are you sure you want to request a refund for this failed job? The refund will be added to your wallet balance.
                    </ModalDescription>
                </ModalHeader>
                <div className="py-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Job</span>
                        <span className="font-medium">{job.requestFileName || `Job #${job.id}`}</span>
                    </div>
                </div>
                <ModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => setShowRefundModal(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Confirm Refund'
                        )}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

