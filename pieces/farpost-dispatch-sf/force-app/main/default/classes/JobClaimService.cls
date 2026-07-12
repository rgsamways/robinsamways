/**
 * Professionals self-claim jobs; the AI ranks and surfaces, it doesn't
 * assign. First-claim-wins, made concurrency-safe with FOR UPDATE rather
 * than last-write-wins.
 */
public with sharing class JobClaimService {

    public class ClaimResult {
        @AuraEnabled public Boolean success;
        @AuraEnabled public String message;
    }

    public class JobAlreadyClaimedException extends Exception {}

    @AuraEnabled
    public static ClaimResult claimJob(Id jobId, Id professionalId) {
        ClaimResult result = new ClaimResult();

        try {
            claimJobInternal(jobId, professionalId);
            result.success = true;
            result.message = 'Job claimed.';
        } catch (JobAlreadyClaimedException e) {
            result.success = false;
            result.message = 'This job has already been claimed by another professional.';
        }

        return result;
    }

    private static void claimJobInternal(Id jobId, Id professionalId) {
        // FOR UPDATE row-locks this Job__c record for the rest of the
        // transaction, so a second, concurrent claim attempt on the same
        // job blocks until this one commits or rolls back, then re-reads
        // the now-committed Status__c rather than a stale value read
        // before this transaction started — what makes first-claim-wins
        // actually safe under real concurrency, not just in a
        // single-user click-through.
        Job__c job = [
            SELECT Id, Status__c, Assigned_Professional__c
            FROM Job__c
            WHERE Id = :jobId
            FOR UPDATE
        ];

        if (job.Status__c != 'Open') {
            throw new JobAlreadyClaimedException(
                'Job ' + jobId + ' is not open (status: ' + job.Status__c + ')'
            );
        }

        job.Status__c = 'Claimed';
        job.Assigned_Professional__c = professionalId;
        update job;
    }
}
