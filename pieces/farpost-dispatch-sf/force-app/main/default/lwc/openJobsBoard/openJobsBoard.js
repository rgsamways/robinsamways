import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import getMyOpenJobs from "@salesforce/apex/OpenJobsController.getMyOpenJobs";
import getCurrentProfessionalId from "@salesforce/apex/OpenJobsController.getCurrentProfessionalId";
import claimJob from "@salesforce/apex/JobClaimService.claimJob";

export default class OpenJobsBoard extends LightningElement {
    jobs = [];
    errorMessage;
    wiredJobsResult;

    @wire(getMyOpenJobs)
    wiredJobs(result) {
        this.wiredJobsResult = result;
        if (result.data) {
            this.jobs = result.data.map((job) => ({ ...job }));
            this.errorMessage = undefined;
        } else if (result.error) {
            this.errorMessage =
                (result.error.body && result.error.body.message) || "Could not load open jobs right now.";
        }
    }

    get hasJobs() {
        return this.jobs && this.jobs.length > 0;
    }

    get showEmptyState() {
        return !this.errorMessage && this.jobs && this.jobs.length === 0;
    }

    async handleClaim(event) {
        const jobId = event.target.dataset.jobId;

        try {
            const professionalId = await getCurrentProfessionalId();
            const result = await claimJob({ jobId, professionalId });

            if (result.success) {
                // A claimed job drops off this professional's own open-jobs
                // board on refresh — refetch rather than mutate locally, so
                // the list always reflects the server's own Status__c.
                await refreshApex(this.wiredJobsResult);
            } else {
                this.jobs = this.jobs.map((job) =>
                    job.jobId === jobId
                        ? { ...job, claimMessage: result.message, alreadyClaimed: true }
                        : job
                );
            }
        } catch (error) {
            const message = (error && error.body && error.body.message) || "Could not claim this job right now.";
            this.jobs = this.jobs.map((job) =>
                job.jobId === jobId ? { ...job, claimMessage: message, alreadyClaimed: true } : job
            );
        }
    }
}
