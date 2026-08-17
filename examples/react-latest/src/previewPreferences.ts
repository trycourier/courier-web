import { type CourierPreferencePage } from '@trycourier/courier-react';

/**
 * Preferences for the same pro as [previewMessages] — the switches behind the
 * week's messages: which jobs reach them, what compliance can interrupt, and how
 * money news arrives. Injected as preview data, so nothing is fetched.
 *
 * The heading and description are blank on purpose: the shots frame the
 * controls, not the page chrome.
 */
export function createPreviewPreferences(): CourierPreferencePage {
  return {
    showCourierFooter: false,
    heading: '',
    description: '',
    channelConfigs: {
      channelLabels: [
        { channel: 'email', name: 'Email' },
        { channel: 'push', name: 'Push' },
        { channel: 'sms', name: 'SMS' },
      ],
    },
    sections: [
      {
        sectionId: 'jobs',
        name: 'Jobs',
        description: 'Invites, bookings, and schedule changes.',
        hasCustomRouting: true,
        routingOptions: ['email', 'push', 'sms'],
        topics: [
          {
            templateId: 'job-invites',
            templateName: 'New job invites',
            description: 'Jobs matched to your trade and travel radius.',
            defaultStatus: 'OPTED_IN',
          },
          {
            templateId: 'schedule-changes',
            templateName: 'Schedule changes',
            description: 'Reschedules, cancellations, and arrival windows.',
            defaultStatus: 'OPTED_IN',
          },
        ],
      },
      {
        sectionId: 'compliance',
        name: 'Compliance',
        description: 'Credentials and documents that can pause your work.',
        hasCustomRouting: true,
        routingOptions: ['email', 'push', 'sms'],
        topics: [
          {
            templateId: 'credential-expirations',
            templateName: 'Credential expirations',
            description: 'Insurance and license renewals that pause new work.',
            defaultStatus: 'REQUIRED',
          },
          {
            templateId: 'documents-to-sign',
            templateName: 'Documents to sign',
            description: 'Work orders waiting on your signature.',
            defaultStatus: 'REQUIRED',
          },
        ],
      },
      {
        sectionId: 'money',
        name: 'Money',
        description: 'Change orders, invoices, and payouts.',
        hasCustomRouting: true,
        routingOptions: ['email', 'push', 'sms'],
        topics: [
          {
            templateId: 'change-orders',
            templateName: 'Change orders',
            description: 'Scope and price changes needing your approval.',
            defaultStatus: 'OPTED_IN',
          },
          {
            templateId: 'invoices-payouts',
            templateName: 'Invoices and payouts',
            description: 'Approvals, deposit dates, and payment receipts.',
            defaultStatus: 'OPTED_IN',
          },
        ],
      },
    ],
    recipientPreferences: [
      // The first topic routes explicitly, so its channel picker shows expanded.
      {
        templateId: 'job-invites',
        status: 'OPTED_IN',
        hasCustomRouting: true,
        routingPreferences: ['push', 'sms'],
      },
      { templateId: 'schedule-changes', status: 'OPTED_IN' },
      { templateId: 'credential-expirations', status: 'OPTED_IN' },
      { templateId: 'documents-to-sign', status: 'OPTED_IN' },
      { templateId: 'change-orders', status: 'OPTED_IN' },
      { templateId: 'invoices-payouts', status: 'OPTED_IN' },
    ],
  };
}
