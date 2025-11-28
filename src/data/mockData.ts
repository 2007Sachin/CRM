export interface StackConfig {
    llm: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-instant';
    tts: 'elevenlabs' | 'deepgram' | 'azure';
    telephony: 'twilio' | 'plivo';
}

export interface MockUser {
    id: string;
    name: string;
    company: string;
    plan: 'Premium' | 'Free';
    status: 'Active' | 'Inactive';
    revenue: number;
    usage_count: number;
    usage_trend: 'Stable' | 'Increasing' | 'Decreasing';
    signup_date: string;
    industry: 'Ecommerce' | 'EdTech' | 'Health Tech' | 'BFSI' | 'Hospitality';
    stack_config: StackConfig;
    cost_per_min: number;
    price_per_min: number;
    margin_percent: number;
    tags: string[];
}

export interface FunnelHistoryItem {
    date: string;
    total_signups: number;
    active_trials: number;
    paid_conversions: number;
    conversion_rate: number;
}

const COSTS = {
    LLM: { 'gpt-4': 0.03, 'gpt-3.5-turbo': 0.0015, 'claude-instant': 0.002 },
    TTS: { 'elevenlabs': 0.05, 'deepgram': 0.015, 'azure': 0.01 },
    Telephony: { 'twilio': 0.015, 'plivo': 0.010 }
};

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const companies = ['TechCorp', 'Innovate', 'GlobalSol', 'NextGen', 'AlphaSys', 'BetaInc', 'CloudNet', 'DataFlow', 'SmartSoft', 'WebWorks', 'CyberDyne', 'BlueSky', 'RedRock', 'GreenField', 'SilverLining'];
const industries = ['Ecommerce', 'EdTech', 'Health Tech', 'BFSI', 'Hospitality'] as const;

const getRandomElement = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const generateUser = (id: number, group: 'A' | 'B' | 'C' | 'D'): MockUser => {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const industry = getRandomElement(industries);

    // Random Stack Config
    const stack_config: StackConfig = {
        llm: getRandomElement(Object.keys(COSTS.LLM)) as any,
        tts: getRandomElement(Object.keys(COSTS.TTS)) as any,
        telephony: getRandomElement(Object.keys(COSTS.Telephony)) as any
    };

    // Calculate Unit Economics
    const cost_per_min = COSTS.LLM[stack_config.llm] + COSTS.TTS[stack_config.tts] + COSTS.Telephony[stack_config.telephony];
    const price_per_min = getRandomFloat(0.12, 0.18);
    const margin_percent = ((price_per_min - cost_per_min) / price_per_min) * 100;

    const tags: string[] = [];
    if (margin_percent < 20) tags.push("Low Margin");
    if (cost_per_min > 0.10) tags.push("High Cost Stack");

    let user: Partial<MockUser> = {
        id: `user-${id}`,
        name: `${firstName} ${lastName}`,
        company: `${getRandomElement(companies)} ${getRandomElement(['LLC', 'Inc', 'Group', 'Systems'])}`,
        industry: industry,
        stack_config,
        cost_per_min: parseFloat(cost_per_min.toFixed(4)),
        price_per_min: parseFloat(price_per_min.toFixed(4)),
        margin_percent: parseFloat(margin_percent.toFixed(1)),
        tags
    };

    const now = new Date();

    // Base values based on group
    switch (group) {
        case 'A': // Cash Cows
            user = {
                ...user,
                plan: 'Premium',
                status: 'Active',
                revenue: getRandomInt(1000, 5000),
                usage_count: getRandomInt(1000, 5000),
                usage_trend: Math.random() > 0.5 ? 'Increasing' : 'Stable',
                signup_date: new Date(now.getTime() - getRandomInt(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
            };
            break;
        case 'B': // Conversion Targets
            user = {
                ...user,
                plan: 'Free',
                status: 'Active',
                revenue: 0,
                usage_count: getRandomInt(300, 800),
                usage_trend: 'Increasing',
                signup_date: new Date(now.getTime() - getRandomInt(15, 90) * 24 * 60 * 60 * 1000).toISOString(),
            };
            break;
        case 'C': // Churn Risk
            user = {
                ...user,
                plan: 'Premium',
                status: 'Active',
                revenue: getRandomInt(500, 2000),
                usage_count: getRandomInt(0, 20),
                usage_trend: 'Decreasing',
                signup_date: new Date(now.getTime() - getRandomInt(60, 365) * 24 * 60 * 60 * 1000).toISOString(),
            };
            break;
        case 'D': // General Pool
            user = {
                ...user,
                plan: 'Free',
                status: 'Active',
                revenue: 0,
                usage_count: getRandomInt(0, 50),
                usage_trend: 'Stable',
                signup_date: new Date(now.getTime() - getRandomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString(),
            };
            break;
    }

    // Apply Industry-Specific Logic
    if (user.plan === 'Premium') {
        if (industry === 'BFSI') {
            // BFSI: Higher Revenue (Enterprise), Lower Count
            user.revenue = (user.revenue || 0) * 2.5;
        } else if (industry === 'Ecommerce') {
            // Ecommerce: Lower Revenue, Higher Count (Volume)
            user.revenue = (user.revenue || 0) * 0.7;
            user.usage_count = (user.usage_count || 0) * 1.5;
        }
    }

    if (industry === 'Health Tech') {
        // Health Tech: High usage duration (simulated by higher usage count)
        user.usage_count = (user.usage_count || 0) * 1.3;
    }

    // Ensure integers
    if (user.revenue) user.revenue = Math.round(user.revenue);
    if (user.usage_count) user.usage_count = Math.round(user.usage_count);

    return user as MockUser;
};

const generateMockData = (): MockUser[] => {
    const users: MockUser[] = [];
    let idCounter = 1;

    // Group A: 20 Users
    for (let i = 0; i < 20; i++) users.push(generateUser(idCounter++, 'A'));

    // Group B: 30 Users
    for (let i = 0; i < 30; i++) users.push(generateUser(idCounter++, 'B'));

    // Group C: 10 Users
    for (let i = 0; i < 10; i++) users.push(generateUser(idCounter++, 'C'));

    // Group D: 40 Users
    for (let i = 0; i < 40; i++) users.push(generateUser(idCounter++, 'D'));

    return users;
};

export const mockUsers = generateMockData();

export const getFunnelHistory = (): FunnelHistoryItem[] => {
    const history: FunnelHistoryItem[] = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Simulate trend: Conversion rate increases from 10% to 25% over 30 days
        // Base rate 10%, plus up to 15% based on progress
        const progress = (30 - i) / 30; // 0 to 1
        const conversionRate = 10 + (progress * 15) + (Math.random() * 2 - 1); // Add some noise

        // Randomize daily signups slightly
        const totalSignups = Math.floor(50 + (progress * 20) + (Math.random() * 10));

        const paidConversions = Math.floor(totalSignups * (conversionRate / 100));
        const activeTrials = Math.floor(totalSignups * 0.6) - paidConversions; // Roughly 60% are active trials or paid

        history.push({
            date: dateStr,
            total_signups: totalSignups,
            active_trials: activeTrials,
            paid_conversions: paidConversions,
            conversion_rate: parseFloat(conversionRate.toFixed(1))
        });
    }

    return history;
};
