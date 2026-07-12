import { LightningElement, api } from "lwc";
import getRecommendations from "@salesforce/apex/JobMatchingService.getRecommendations";

export default class JobRecommendationPanel extends LightningElement {
    @api recordId;

    candidates = [];
    isLoading = false;
    hasSearched = false;
    errorMessage;

    get hasCandidates() {
        return this.candidates && this.candidates.length > 0;
    }

    get showEmptyState() {
        return this.hasSearched && !this.isLoading && !this.errorMessage && !this.hasCandidates;
    }

    async handleGetRecommendations() {
        this.isLoading = true;
        this.errorMessage = undefined;
        try {
            this.candidates = await getRecommendations({ jobId: this.recordId });
        } catch (error) {
            this.errorMessage =
                (error && error.body && error.body.message) || "Could not load recommendations right now.";
            this.candidates = [];
        } finally {
            this.isLoading = false;
            this.hasSearched = true;
        }
    }
}
