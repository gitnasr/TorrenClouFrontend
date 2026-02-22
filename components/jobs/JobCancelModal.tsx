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

interface JobCancelModalProps {
    job: Job
    onConfirm: () => void
    loading?: boolean
}

export function JobCancelModal({ job, onConfirm, loading }: JobCancelModalProps) {
    const { showCancelModal, setShowCancelModal } = useJobsStore()

    return (
        <Modal open={showCancelModal} onOpenChange={setShowCancelModal}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Cancel Job</ModalTitle>
                    <ModalDescription>
                        Are you sure you want to cancel this job? A refund will be automatically processed if applicable.
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
                        onClick={() => setShowCancelModal(false)}
                        disabled={loading}
                    >
                        Keep Job
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            'Confirm Cancel'
                        )}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}



