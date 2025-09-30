import { useStatusBar } from '../Components/StatusBarProvider';

class BackgroundJobService {
    constructor() {
        this.statusBar = null;
        this.jobs = new Map();
    }

    // Initialize with status bar context
    init(statusBar) {
        this.statusBar = statusBar;
    }

    // Start monitoring an export job
    startExportJob(jobId, type) {
        if (!this.statusBar) return;

        const job = {
            id: jobId,
            type: type,
            status: 'started',
            message: `Iniciando exportação de ${type}...`,
            progress: 0
        };

        this.jobs.set(jobId, job);
        
        this.statusBar.addNotification(
            job.message,
            'processing',
            null // No auto-remove for processing jobs
        );
    }

    // Update job progress
    updateJobProgress(jobId, progress) {
        if (!this.statusBar) return;

        const job = this.jobs.get(jobId);
        
        if (job) {
            job.progress = progress;
            job.message = `Exportando ${job.type}... ${progress}%`;
            
            // Update the notification with progress
            this.statusBar.addNotification(
                job.message,
                'processing',
                null // No auto-remove for processing jobs
            );
        }
    }

    // Complete a job
    completeJob(jobId, success = true, message = null) {
        if (!this.statusBar) return;

        const job = this.jobs.get(jobId);
        
        if (job) {
            if (success) {
                job.status = 'completed';
                job.message = message || `Exportação de ${job.type} concluída com sucesso!`;
                
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
            
            // Remove job after completion
            this.jobs.delete(jobId);
        }
    }
}

// Export singleton instance
export default new BackgroundJobService();