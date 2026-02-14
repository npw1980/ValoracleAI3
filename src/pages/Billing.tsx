import { useState } from 'react';
import {
  Check,
  CreditCard,
  Building2,
  Crown,
  Download,
  Plus,
  Edit,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    period: 'month',
    description: 'For individuals and small teams',
    features: [
      'Up to 5 users',
      '10 assets',
      'Basic HEOR models',
      'Standard support',
      '1GB storage',
    ],
    notIncluded: [
      'Advanced analytics',
      'RWD access',
      'API access',
      'Custom integrations',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 999,
    period: 'month',
    description: 'For growing teams',
    popular: true,
    features: [
      'Up to 25 users',
      '50 assets',
      'Advanced HEOR models',
      'Priority support',
      '50GB storage',
      'RWD data catalog',
      'API access',
      'Custom integrations',
    ],
    notIncluded: [
      'Unlimited users',
      'Dedicated infrastructure',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    period: 'custom',
    description: 'For large organizations',
    features: [
      'Unlimited users',
      'Unlimited assets',
      'Full HEOR suite',
      'Dedicated support',
      'Unlimited storage',
      'Full RWD access',
      'Full API access',
      'Custom integrations',
      'Dedicated infrastructure',
      'SLA guarantees',
      'Custom training',
    ],
    notIncluded: [],
  },
];

const invoices = [
  { id: '1', date: 'Feb 1, 2026', amount: 999, status: 'Paid', description: 'Professional Plan - Monthly' },
  { id: '2', date: 'Jan 1, 2026', amount: 999, status: 'Paid', description: 'Professional Plan - Monthly' },
  { id: '3', date: 'Dec 1, 2025', amount: 999, status: 'Paid', description: 'Professional Plan - Monthly' },
  { id: '4', date: 'Nov 1, 2025', amount: 499, status: 'Paid', description: 'Starter Plan - Monthly' },
];

const usageMetrics = [
  { label: 'Users', current: 8, limit: 25, unit: 'users' },
  { label: 'Assets', current: 12, limit: 50, unit: 'assets' },
  { label: 'Storage', current: 23, limit: 50, unit: 'GB' },
  { label: 'API Calls', current: 4523, limit: 10000, unit: 'calls' },
  { label: 'RWD Queries', current: 156, limit: 500, unit: 'queries' },
];

export function Billing() {
  const [currentPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getPlanPrice = (plan: typeof plans[0]) => {
    if (plan.price === null) return 'Custom';
    if (billingCycle === 'annual') return Math.round(plan.price * 0.8);
    return plan.price;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Billing & Subscription</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your subscription and billing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Edit className="w-4 h-4" />
            Update Payment
          </Button>
        </div>
      </div>

      {/* Current Plan Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Current Plan</p>
                <h2 className="text-xl font-bold">Professional Plan</h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Next billing date</p>
                <p className="font-semibold">March 1, 2026</p>
              </div>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                Change Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {usageMetrics.map((metric) => {
              const percentage = (metric.current / metric.limit) * 100;
              const isNearLimit = percentage > 80;
              return (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{metric.label}</span>
                    {isNearLimit && (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {metric.current.toLocaleString()}
                    <span className="text-sm font-normal text-slate-500"> / {metric.limit.toLocaleString()}</span>
                  </p>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isNearLimit ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className={`w-14 h-7 rounded-full transition-colors relative ${
            billingCycle === 'annual' ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>
          Annual
          <Badge variant="success" className="ml-2">Save 20%</Badge>
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.popular ? 'elevated' : 'bordered'}
            className={`relative ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  {plan.price === null ? (
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-slate-800 dark:text-white">
                        ${getPlanPrice(plan)}
                      </span>
                      <span className="text-slate-500">/{billingCycle === 'annual' ? 'mo' : 'month'}</span>
                    </>
                  )}
                </div>
                {billingCycle === 'annual' && plan.price !== null && (
                  <p className="text-sm text-green-600 mt-1">Billed annually (${Number(getPlanPrice(plan)) * 12}/year)</p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm opacity-50">
                    <span className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.id === currentPlan ? 'secondary' : plan.popular ? 'primary' : 'secondary'}
                className="w-full"
                disabled={plan.id === currentPlan}
              >
                {plan.id === currentPlan ? 'Current Plan' : plan.price === null ? 'Contact Sales' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 dark:text-white">Visa ending in 4242</p>
                <p className="text-sm text-slate-500">Expires 12/2027</p>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="secondary" className="w-full">
                <Plus className="w-4 h-4" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-white">ValOracle Inc.</p>
                  <p className="text-sm text-slate-500">billing@valoracle.ai</p>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <div className="text-sm text-slate-500">
                <p>Billing address:</p>
                <p className="text-slate-700 dark:text-slate-400">
                  123 Innovation Drive<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice History</CardTitle>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{invoice.description}</p>
                  <p className="text-sm text-slate-500">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-slate-800 dark:text-white">${invoice.amount}</p>
                  <Badge variant="success">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
