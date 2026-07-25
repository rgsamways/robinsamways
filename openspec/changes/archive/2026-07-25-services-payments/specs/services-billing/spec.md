## ADDED Requirements

### Requirement: Visitor can subscribe to Troubleshooting & Questions for $12/year
The system SHALL let a visitor start a Stripe Checkout session for an annual $12 subscription unlocking ongoing Troubleshooting & Questions access, creating an `account-auth` account for them if one doesn't already exist, and SHALL record an active `Subscription` attached to that account once Stripe confirms payment.

#### Scenario: Successful subscription checkout activates access
- **WHEN** a visitor completes Stripe Checkout for the Troubleshooting & Questions plan
- **THEN** the system records an active `Subscription` attached to their account with period number 1 and the amount actually charged

### Requirement: Subscriber can manage their subscription via Stripe's Customer Portal
The system SHALL let a signed-in subscriber open a Stripe Customer Portal session to view their subscription status and cancel it, rather than through custom account-management UI — the same low-friction mechanism used for this purpose regardless of what auth approach any other project uses.

#### Scenario: Subscriber opens the Customer Portal
- **WHEN** a signed-in subscriber requests to manage their subscription
- **THEN** the system generates a Stripe Customer Portal session scoped to their own Stripe customer record and redirects them to it

### Requirement: Subscription tracks billed period number and actual charged amount
Each `Subscription` record SHALL track which billed period it is currently in (1 for the original signup year, incrementing on each successful renewal) and the actual amount Stripe charged for the current period, sourced from the real invoice rather than assumed equal to the list price.

#### Scenario: A successful renewal increments the period number
- **WHEN** Stripe reports a successful renewal invoice payment for an existing subscription
- **THEN** the system increments that subscription's period number and updates its recorded charged amount and current period dates from the real invoice

### Requirement: Canceling during the first billed period retains the full payment
Canceling a subscription while it is in period 1 SHALL NOT trigger any automatic refund. The subscription SHALL remain active through the end of the already-paid period and SHALL NOT renew.

#### Scenario: Canceling in year one keeps access through the paid period
- **WHEN** a subscriber cancels while their subscription is in period 1
- **THEN** the system leaves the subscription active until the current period ends, issues no refund, and does not renew it

### Requirement: Canceling during a renewal period refunds unused days proportionally
Canceling a subscription while it is in period 2 or later SHALL immediately end the subscription and SHALL trigger a refund proportional to the unused days remaining in the current period, computed against the amount actually charged for that period (not the nominal list price).

#### Scenario: Mid-period cancellation in a renewal year triggers a proportional refund
- **WHEN** a subscriber cancels partway through period 2 or later
- **THEN** the system ends the subscription immediately and issues a refund equal to the unused-days fraction of the amount actually charged for that period

### Requirement: A completed one-time engagement can be invoiced a fulfillment fee
The system SHALL allow recording a one-time `FulfillmentFee` tied to a specific completed engagement (Web Sites, Web Applications, Native Applications, Platform, Hourly, or Field Documentation), invoiced to the client after the work is delivered, independent of the Troubleshooting & Questions subscription.

#### Scenario: A delivered engagement generates a fulfillment fee invoice
- **WHEN** an engagement in one of the non-subscription service categories is marked complete
- **THEN** the system creates a `FulfillmentFee` record and issues a Stripe invoice for the agreed amount

### Requirement: A payment dispute suspends subscription access
If Stripe reports a dispute against a subscription's charge, the system SHALL mark that subscription as no longer active.

#### Scenario: A disputed charge suspends the subscription
- **WHEN** Stripe reports a dispute against a Troubleshooting & Questions subscription charge
- **THEN** the system marks that subscription as inactive
