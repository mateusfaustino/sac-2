import { useStatusBar } from '../Components/StatusBarProvider';

class BackgroundJobService {
    constructor() {
        this.statusBar = null;
        this.jobs = new Map();
        this.jobCallbacks = new Map(); // Store callbacks for job events
    }

    // Initialize with status bar context
    init(statusBar) {
        this.statusBar = statusBar;
    }

    // Register callbacks for a job
    registerJobCallbacks(jobId, callbacks) {
        this.jobCallbacks.set(jobId, callbacks);
    }

    // Start monitoring an export job
    startExportJob(jobId, type, recordCount = 0) {
        if (!this.statusBar) return;

        const job = {
            id: jobId,
            type: type,
            status: 'started',
            message: `Iniciando exportação de ${type}...`,
            progress: 0,
            recordCount: recordCount, // Number of records to export
            startTime: Date.now()
        };

        this.jobs.set(jobId, job);
        
        this.statusBar.addNotification(
            job.message,
            'processing',
            null // No auto-remove for processing jobs
        );
        
        // Notify callbacks if any
        const callbacks = this.jobCallbacks.get(jobId);
        if (callbacks && callbacks.onStart) {
            callbacks.onStart(job);
        }
    }

    // Update job progress
    updateJobProgress(jobId, progress, message = null) {
        if (!this.statusBar) return;

        const job = this.jobs.get(jobId);
        
        if (job) {
            job.progress = progress;
            job.message = message || `Exportando ${job.type}... ${progress}%`;
            
            // Update the notification with progress
            this.statusBar.addNotification(
                job.message,
                'processing',
                null // No auto-remove for processing jobs
            );
            
            // Notify callbacks if any
            const callbacks = this.jobCallbacks.get(jobId);
            if (callbacks && callbacks.onProgress) {
                callbacks.onProgress(job);
            }
        }
    }

    // Complete a job
    completeJob(jobId, success = true, message = null, downloadUrl = null) {
        if (!this.statusBar) return;

        const job = this.jobs.get(jobId);
        
        if (job) {
            if (success) {
                job.status = 'completed';
                job.message = message || `Exportação de ${job.type} concluída com sucesso!`;
                job.downloadUrl = downloadUrl;
                
                this.statusBar.addNotification(
                    job.message,
                    'success',
                    5000
                );
            } else {
                job.status = 'failed';
                job.message = message || `Falha na exportação de ${job.type}`;
                
                this.statusBar.addNotification(
                    job.message,
                    'error',
                    10000
                );
            }
            
            // Notify callbacks if any
            const callbacks = this.jobCallbacks.get(jobId);
            if (callbacks) {
                if (success && callbacks.onComplete) {
                    callbacks.onComplete(job);
                } else if (!success && callbacks.onError) {
                    callbacks.onError(job);
                }
            }
            
            // Remove job after completion
            this.jobs.delete(jobId);
            this.jobCallbacks.delete(jobId);
        }
    }
    
    // Get job status
    getJobStatus(jobId) {
        return this.jobs.get(jobId) || null;
    }
    
    // Cancel a job
    cancelJob(jobId) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.status = 'cancelled';
            job.message = `Exportação de ${job.type} cancelada`;
            
            this.statusBar.addNotification(
                job.message,
                'warning',
                5000
            );
            
            // Notify callbacks if any
            const callbacks = this.jobCallbacks.get(jobId);
            if (callbacks && callbacks.onCancel) {
                callbacks.onCancel(job);
            }
            
            // Remove job
            this.jobs.delete(jobId);
            this.jobCallbacks.delete(jobId);
        }
    }
}

// Export singleton instance
export default new BackgroundJobService();