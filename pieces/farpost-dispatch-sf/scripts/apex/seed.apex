// Fictional seed data for Farpost Dispatch — 12 Professionals (Contacts)
// and 12 Jobs spanning all 7 North Hastings-area regions and all 5
// certification/job types, with a genuine rating spread (3.5-4.9) and
// deliberate matching variation: some jobs have several eligible
// candidates, some have exactly one, and one has zero (to exercise the
// "no eligible candidates" path without a live Anthropic callout).
//
// Run once, after deployment, via:
//   sf apex run --file scripts/apex/seed.apex --target-org <org alias>

List<Contact> professionals = new List<Contact>{
    new Contact(
        FirstName = 'Alex', LastName = 'Novak',
        Service_Region__c = 'Bancroft', Certifications__c = 'Electrical;General Inspection',
        Availability_Status__c = 'Available', Rating__c = 4.8
    ),
    new Contact(
        FirstName = 'Priya', LastName = 'Chandra',
        Service_Region__c = 'Bancroft', Certifications__c = 'Septic/Well',
        Availability_Status__c = 'Available', Rating__c = 4.2
    ),
    new Contact(
        FirstName = 'Derek', LastName = 'Fenwick',
        Service_Region__c = 'Bancroft', Certifications__c = 'Roofing',
        Availability_Status__c = 'Unavailable', Rating__c = 4.6
    ),
    new Contact(
        FirstName = 'Naomi', LastName = 'Okafor',
        Service_Region__c = 'Faraday', Certifications__c = 'Electrical',
        Availability_Status__c = 'Available', Rating__c = 3.9
    ),
    new Contact(
        FirstName = 'Sam', LastName = 'Whitfield',
        Service_Region__c = 'Faraday', Certifications__c = 'Foundation/Structural;General Inspection',
        Availability_Status__c = 'Available', Rating__c = 4.4
    ),
    new Contact(
        FirstName = 'Tasha', LastName = 'Boudreau',
        Service_Region__c = 'Carlow/Mayo', Certifications__c = 'Septic/Well;Electrical',
        Availability_Status__c = 'Available', Rating__c = 4.0
    ),
    new Contact(
        FirstName = 'Ravi', LastName = 'Bhatt',
        Service_Region__c = 'Hastings Highlands', Certifications__c = 'Roofing',
        Availability_Status__c = 'Available', Rating__c = 3.5
    ),
    new Contact(
        FirstName = 'Colin', LastName = 'McAra',
        Service_Region__c = 'Hastings Highlands', Certifications__c = 'Roofing;General Inspection',
        Availability_Status__c = 'Available', Rating__c = 4.9
    ),
    new Contact(
        FirstName = 'Jenna', LastName = 'Sootheran',
        Service_Region__c = 'Limerick', Certifications__c = 'Foundation/Structural',
        Availability_Status__c = 'Available', Rating__c = 3.8
    ),
    new Contact(
        FirstName = 'Owen', LastName = 'Kaminski',
        Service_Region__c = 'Tudor and Cashel', Certifications__c = 'General Inspection',
        Availability_Status__c = 'Available', Rating__c = 4.1
    ),
    new Contact(
        FirstName = 'Bree', LastName = 'Langille',
        Service_Region__c = 'Wollaston', Certifications__c = 'Septic/Well',
        Availability_Status__c = 'Available', Rating__c = 4.7
    ),
    new Contact(
        FirstName = 'Marco', LastName = 'Delisle',
        Service_Region__c = 'Wollaston', Certifications__c = 'Electrical;Roofing',
        Availability_Status__c = 'Available', Rating__c = 3.6
    )
};
insert professionals;

List<Job__c> jobs = new List<Job__c>{
    new Job__c(
        Region__c = 'Bancroft', Job_Type__c = 'Electrical', Urgency__c = 'High', Status__c = 'Open',
        Description__c = 'Panel replacement after storm damage — power intermittently cutting out.'
    ),
    new Job__c(
        Region__c = 'Bancroft', Job_Type__c = 'Septic/Well', Urgency__c = 'Medium', Status__c = 'Open',
        Description__c = 'Routine septic inspection, first-time buyer request ahead of closing.'
    ),
    new Job__c(
        Region__c = 'Faraday', Job_Type__c = 'Electrical', Urgency__c = 'Low', Status__c = 'Open',
        Description__c = 'Minor wiring inspection for an insurance renewal.'
    ),
    new Job__c(
        Region__c = 'Faraday', Job_Type__c = 'Foundation/Structural', Urgency__c = 'High', Status__c = 'Open',
        Description__c = 'Foundation crack reported after spring thaw — adjuster flagged as urgent.'
    ),
    new Job__c(
        Region__c = 'Carlow/Mayo', Job_Type__c = 'Septic/Well', Urgency__c = 'Medium', Status__c = 'Open',
        Description__c = 'Septic tank pump-out overdue, owner reports slow drains.'
    ),
    new Job__c(
        Region__c = 'Hastings Highlands', Job_Type__c = 'Roofing', Urgency__c = 'High', Status__c = 'Open',
        Description__c = 'Storm-damaged roof, temporary tarping needed before the next rain.'
    ),
    new Job__c(
        Region__c = 'Limerick', Job_Type__c = 'Foundation/Structural', Urgency__c = 'Medium', Status__c = 'Open',
        Description__c = 'Hairline foundation cracks noticed during a routine walkthrough.'
    ),
    new Job__c(
        Region__c = 'Tudor and Cashel', Job_Type__c = 'General Inspection', Urgency__c = 'Low', Status__c = 'Open',
        Description__c = 'Pre-listing general inspection for a property going on the market.'
    ),
    new Job__c(
        Region__c = 'Wollaston', Job_Type__c = 'Septic/Well', Urgency__c = 'High', Status__c = 'Open',
        Description__c = 'Septic backup reported same-day — owner without a working toilet.'
    ),
    new Job__c(
        Region__c = 'Wollaston', Job_Type__c = 'Electrical', Urgency__c = 'Medium', Status__c = 'Open',
        Description__c = 'Breaker panel tripping repeatedly under normal household load.'
    ),
    new Job__c(
        // Deliberately zero eligible candidates: the only Roofing-certified
        // professional in Bancroft (Derek Fenwick) is marked Unavailable.
        Region__c = 'Bancroft', Job_Type__c = 'Roofing', Urgency__c = 'Medium', Status__c = 'Open',
        Description__c = 'Shingle repair after a fallen branch — no active leak yet.'
    ),
    new Job__c(
        Region__c = 'Carlow/Mayo', Job_Type__c = 'Electrical', Urgency__c = 'Low', Status__c = 'Open',
        Description__c = 'Outdoor outlet installation for a new shed.'
    )
};
insert jobs;

System.debug('Seeded ' + professionals.size() + ' professionals and ' + jobs.size() + ' jobs.');
