/**
 * Backs the openJobsBoard LWC: the logged-in Professional's own matching
 * Open jobs, plus an "AI-recommended" flag.
 */
public with sharing class OpenJobsController {

    public class JobBoardItem {
        @AuraEnabled public Id jobId;
        @AuraEnabled public String jobType;
        @AuraEnabled public String region;
        @AuraEnabled public String urgency;
        @AuraEnabled public String description;
        @AuraEnabled public Boolean aiRecommended;
    }

    @AuraEnabled(cacheable=true)
    public static List<JobBoardItem> getMyOpenJobs() {
        Id currentContactId = getCurrentContactId();
        if (currentContactId == null) {
            return new List<JobBoardItem>();
        }
        return getOpenJobsForContact(currentContactId);
    }

    // JobClaimService.claimJob takes a Contact Id, not a User Id — the LWC
    // resolves "who am I, as a Professional" through this method rather
    // than assuming the platform User Id can be used directly, since
    // Assigned_Professional__c is a lookup to Contact, not User.
    @AuraEnabled(cacheable=true)
    public static Id getCurrentProfessionalId() {
        return getCurrentContactId();
    }

    // Split out from getMyOpenJobs() so the actual matching/recommendation
    // logic is unit-testable without an Experience Cloud Partner Community
    // user already existing — that user-to-Contact association is only
    // created once Robin does the manual Experience Cloud setup in
    // design.md's Migration Plan step 9, so it can't be created by an Apex
    // test in this build. getCurrentContactId() itself stays uncovered
    // for that same reason; everything downstream of a resolved Contact
    // Id is fully covered.
    @TestVisible
    private static List<JobBoardItem> getOpenJobsForContact(Id contactId) {
        Contact me = [
            SELECT Id, Service_Region__c, Certifications__c, Rating__c
            FROM Contact
            WHERE Id = :contactId
            LIMIT 1
        ];

        if (String.isBlank(me.Service_Region__c) || String.isBlank(me.Certifications__c)) {
            return new List<JobBoardItem>();
        }

        List<Job__c> jobs = [
            SELECT Id, Job_Type__c, Region__c, Urgency__c, Description__c
            FROM Job__c
            WHERE Status__c = 'Open'
              AND Region__c = :me.Service_Region__c
              AND Job_Type__c IN :splitCertifications(me.Certifications__c)
            ORDER BY Urgency__c ASC, CreatedDate DESC
            LIMIT 50
        ];

        List<JobBoardItem> items = new List<JobBoardItem>();
        for (Job__c job : jobs) {
            JobBoardItem item = new JobBoardItem();
            item.jobId = job.Id;
            item.jobType = job.Job_Type__c;
            item.region = job.Region__c;
            item.urgency = job.Urgency__c;
            item.description = job.Description__c;
            item.aiRecommended = isTopRatedEligibleCandidate(job, me);
            items.add(item);
        }
        return items;
    }

    // "AI-recommended" here reflects the same Rating-based secondary signal
    // JobMatchingService's own ranking uses, computed without a live
    // Anthropic callout on every portal page load — the recommendation
    // panel already covers the on-demand, callout-backed reasoning;
    // re-invoking it once per job per board view would multiply callout
    // volume with portal traffic, which the design deliberately avoids
    // (see design.md's Risks/Trade-offs section). Fine at this piece's
    // fictional-data scale (a handful of jobs per professional's board).
    private static Boolean isTopRatedEligibleCandidate(Job__c job, Contact me) {
        List<Contact> eligible = [
            SELECT Id, Rating__c
            FROM Contact
            WHERE Service_Region__c = :job.Region__c
              AND Certifications__c INCLUDES (:job.Job_Type__c)
              AND Availability_Status__c = 'Available'
            ORDER BY Rating__c DESC NULLS LAST
            LIMIT 1
        ];

        return !eligible.isEmpty() && eligible[0].Id == me.Id;
    }

    private static List<String> splitCertifications(String certifications) {
        return certifications.split(';');
    }

    private static Id getCurrentContactId() {
        User currentUser = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return currentUser.ContactId;
    }
}
