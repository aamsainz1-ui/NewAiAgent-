# Sync (CHRO) - Chief Human Resources Agent Knowledge Base
*Compiled: 2026-02-27 | Focus: Distributed Teams in Southeast Asia - Gambling/Marketing Industries*

---

## 1. Remote Team Management Across Time Zones

### Time Zone Landscape in SEA
| Country | Time Zone | UTC Offset | Key Cities |
|---------|-----------|------------|------------|
| Thailand | ICT (Indochina Time) | UTC+7 | Bangkok, Chiang Mai |
| Vietnam | ICT | UTC+7 | Ho Chi Minh, Hanoi |
| Indonesia | WIB/WITA/WIT | UTC+7/8/9 | Jakarta, Bali |
| Philippines | PHT | UTC+8 | Manila, Cebu |
| Malaysia | MYT | UTC+8 | Kuala Lumpur |
| Singapore | SGT | UTC+8 | Singapore |
| China | CST | UTC+8 | Shanghai, Beijing |

### Best Practices for Cross-Timezone Teams

**Core Working Hours Strategy**
- Establish 3-4 hour "overlap windows" where all teams are online
- For SEA teams: 10:00-14:00 ICT/UTC+7 works well (covers TH/VN/ID + CN/PH/MY/SG)
- Use async-first communication for non-urgent matters

**Meeting Scheduling Rules**
- Rotate meeting times to share pain of odd hours
- Record all meetings for async review
- Use "follow the sun" handoff documentation
- Limit real-time meetings to 20% of work time

**Communication Stack Recommendations**
1. **Slack/Discord** - Real-time chat with timezone indicators
2. **Loom** - Async video updates
3. **Notion/Confluence** - Documentation single source of truth
4. **Linear/Jira** - Async project tracking
5. **Calendly/When2meet** - Cross-timezone scheduling

---

## 2. KPI Frameworks for Marketing Teams (CPA, LTV, ROI)

### Gambling/Affiliate Marketing KPIs

**Acquisition Metrics**
| KPI | Formula | Target Benchmark |
|-----|---------|------------------|
| CPA (Cost Per Acquisition) | Total Spend / New Depositors | $50-150 (varies by geo) |
| CPC (Cost Per Click) | Total Spend / Clicks | $0.50-3.00 |
| CTR (Click-Through Rate) | Clicks / Impressions × 100 | 1-5% |
| Conversion Rate | Depositors / Clicks × 100 | 2-10% |

**Retention & Value Metrics**
| KPI | Formula | Target Benchmark |
|-----|---------|------------------|
| LTV (Lifetime Value) | Average Revenue Per User × Lifespan | $200-500+ |
| ARPU (Average Revenue Per User) | Total Revenue / Active Users | $50-150/month |
| Churn Rate | Lost Users / Total Users × 100 | <5%/month |
| Retention D1/D7/D30 | Users active at day N / Day 0 | 40%/20%/10% |

**ROI & Efficiency Metrics**
| KPI | Formula | Target Benchmark |
|-----|---------|------------------|
| ROAS | Revenue / Ad Spend | 3:1 to 5:1 |
| ROI | (Revenue - Cost) / Cost × 100 | 200-400% |
| Payback Period | CPA / Daily Revenue Per User | <30 days |
| MER (Marketing Efficiency Ratio) | Total Revenue / Total Marketing Cost | 4:1 to 8:1 |

### KPI Dashboard Structure
```
Executive Summary (Weekly)
├── Revenue: $XXX,XXX (↑X%)
├── New FTDs: XXX (↑X%)
├── Blended CPA: $XX (↑/↓ X%)
├── LTV/CAC Ratio: X.X
└── ROAS: X.X:1

Channel Breakdown
├── Paid Social (Meta/TikTok)
├── Search (Google/Bing)
├── Native/Display
├── Affiliate
└── Organic

Funnel Metrics
├── Impressions → Clicks
├── Clicks → Registrations
├── Registrations → FTDs
└── FTDs → Active Players
```

---

## 3. Performance Tracking Automation

### Automated KPI Tracking Stack

**Data Collection Layer**
- **Google Analytics 4** - Web/app analytics
- **AppsFlyer/Adjust** - Mobile attribution
- **Voluum/RedTrack** - Affiliate tracking
- **Facebook/TikTok/Google APIs** - Ad platform data

**Data Warehouse Layer**
- **BigQuery/Snowflake** - Centralized data storage
- **Fivetran/Airbyte** - ETL pipelines
- **dbt** - Data transformation

**Visualization Layer**
- **Looker Studio** - Free, good for basic dashboards
- **Tableau** - Enterprise-grade visualizations
- **Metabase** - Open-source alternative
- **Grafana** - Real-time monitoring

**Alerting Layer**
- **Slack webhooks** - Instant notifications
- **PagerDuty** - Critical alert escalation
- **n8n/Make** - Workflow automation

### Automated Reporting Cadence
| Report | Frequency | Audience | Delivery |
|--------|-----------|----------|----------|
| Executive Summary | Daily | C-Level | Slack + Email |
| Channel Performance | Daily | Marketing Managers | Dashboard |
| Creative Performance | Weekly | Creative Team | Slack |
| LTV/Cohort Analysis | Weekly | Growth Team | Email |
| Full P&L | Monthly | All Stakeholders | PDF + Meeting |

---

## 4. Commission/Compensation Structures for Sales Teams

### Affiliate Manager Compensation Models

**Model A: Revenue Share (Standard)**
- Base Salary: $1,500-3,000/month (SEA market)
- Commission: 3-8% of affiliate revenue
- Bonus: 20-50% of monthly salary for hitting targets

**Model B: Hybrid (Performance-Focused)**
- Base Salary: $1,000-2,000/month
- Commission: 5-10% of new affiliate revenue
- Retention Bonus: 2-5% of existing affiliate revenue
- Target: 15-20% of total comp from variable

**Model C: High-Base (Enterprise)**
- Base Salary: $3,000-5,000/month
- Commission: 2-5% of managed portfolio
- Annual bonus based on portfolio growth

### Sales Team Tier Structure

| Tier | Monthly Revenue | Base | Commission | Total Target |
|------|-----------------|------|------------|--------------|
| Junior | $0-50K | $1,200 | 3% | $2,700 |
| Mid | $50-150K | $2,000 | 4% | $6,000 |
| Senior | $150-500K | $3,000 | 5% | $15,000 |
| Lead/Manager | $500K+ | $4,000 | 6% + team override | $25,000+ |

### Commission Calculation Rules
1. **First Deposit Attribution** - Commission paid on player's first 30 days
2. **Negative Carryover** - Losses carry to next month (standard in gambling)
3. **Minimum Activity** - Affiliates must bring 5+ FTDs to earn
4. **Fraud Clawback** - 90-day clawback period for chargebacks/fraud

---

## 5. Recruitment Strategies for Grey Market Industries

### Sourcing Channels (Gambling/iGaming)

**Primary Channels**
1. **LinkedIn** - Discreet outreach, use "iGaming" not "gambling"
2. **Industry Job Boards**
   - iGaming Business Jobs
   - Casino Careers
   - Betting Jobs
   - Gaming Talent Network
3. **Referral Programs** - 20-30% of hires, highest quality
4. **Affiliate Conferences** - SIGMA, ICE, iGB Affiliate

**Secondary Channels**
- **Telegram Groups** - Regional iGaming communities
- **Local Recruitment Agencies** - Specialized in gambling
- **Competitor Poaching** - Direct outreach to top performers

### Job Posting Best Practices
- Use "iGaming" or "online gaming" terminology
- Emphasize remote work and international team
- Highlight compensation (often above market)
- Mention growth opportunities, not just current role

### Interview Process for Grey Market
1. **Screening Call** - Verify experience, assess cultural fit
2. **Skills Assessment** - Case study or practical test
3. **Team Interview** - Meet potential colleagues
4. **Final Interview** - Compensation negotiation
5. **Background Check** - Verify past employment (discreetly)

### Compliance Considerations
- Ensure candidates understand legal grey area
- Verify work authorization in their country
- Use contractor agreements where full employment risky
- Maintain separate legal entities for operations

---

## 6. Team Productivity Tools and Workflows

### Recommended Tech Stack

**Communication**
| Tool | Purpose | Cost |
|------|---------|------|
| Slack | Team chat | $7.25/user/mo |
| Discord | Community/ops | Free-$9.99/mo |
| Zoom | Video calls | $13.99/host/mo |
| Loom | Async video | Free-$12.50/mo |

**Project Management**
| Tool | Best For | Cost |
|------|----------|------|
| Linear | Engineering | Free-$8/user/mo |
| Notion | Documentation | Free-$8/user/mo |
| ClickUp | All-in-one | Free-$7/user/mo |
| Monday.com | Marketing ops | $8/user/mo |

**HR & Operations**
| Tool | Purpose | Cost |
|------|---------|------|
| Deel | Global payroll | $49/contractor/mo |
| Remote | EOR + payroll | Custom pricing |
| BambooHR | HRIS | $6-12/user/mo |
| Factorial | Time tracking | Free-$4/user/mo |

### Workflow Automation

**Onboarding Automation (n8n/Make)**
```
New Hire Added → Send Welcome Email → Create Accounts
    → Schedule Orientation → Assign Buddy → 30-Day Check-in
```

**Performance Review Automation**
```
Quarterly Trigger → Self-Assessment Form → Manager Review
    → Calibration Meeting → Compensation Update → 1:1 Discussion
```

**Offboarding Automation**
```
Resignation Notice → Knowledge Transfer Plan → Access Revocation
    → Exit Interview → Final Pay → Alumni Network Invite
```

---

## 7. Cultural Differences in Managing SEA Teams

### Thailand
**Work Culture**
- Hierarchical respect for authority
- "Sanuk" (fun) important in workplace
- Avoid direct confrontation (save face)
- Loyalty valued over short-term gains

**Management Tips**
- Build personal relationships before business
- Use indirect feedback ("perhaps consider...")
- Respect seniority in team structure
- Allow time for social bonding

### Vietnam
**Work Culture**
- Hardworking and ambitious
- Direct communication style
- Strong technical talent pool
- Growing startup ecosystem

**Management Tips**
- Set clear, measurable goals
- Provide growth opportunities
- Competitive compensation essential
- Merit-based recognition works well

### Indonesia
**Work Culture**
- Relationship-oriented ("gotong royong")
- Religious considerations (prayer times)
- Large, diverse market
- Strong family values

**Management Tips**
- Accommodate prayer schedules
- Build team cohesion activities
- Respect local holidays (many)
- Understand regional differences (Java vs others)

### Philippines
**Work Culture**
- Excellent English proficiency
- Western-influenced business culture
- Strong customer service orientation
- BPO/remote work experience

**Management Tips**
- Direct feedback is acceptable
- Career advancement important
- Stable employment preferred
- Night shift premiums expected

### China
**Work Culture**
- "996" culture (9am-9pm, 6 days) fading but present
- WeChat dominates communication
- Relationship ("guanxi") critical
- Fast-paced, results-driven

**Management Tips**
- Use WeChat for daily communication
- Build relationships outside work
- Set aggressive but achievable targets
- Understand government holiday impacts

---

## 8. Automation of HR Processes

### Payroll Automation

**Multi-Country Payroll Solutions**
| Provider | Coverage | Best For |
|----------|----------|----------|
| Deel | 150+ countries | Contractors |
| Remote | 80+ countries | Full-time employees |
| Papaya Global | 160+ countries | Enterprise |
| Wise Business | Transfers | Cost-effective payments |

**Payroll Automation Workflow**
```
Time Tracking → Approval → Calculation → Compliance Check
    → Payment Processing → Payslip Generation → Reporting
```

### Attendance & Time Tracking

**Tools Comparison**
| Tool | Features | Price |
|------|----------|-------|
| Clockify | Free tier, simple | Free-$3.99/mo |
| Hubstaff | Screenshots, activity | $5.83/user/mo |
| Time Doctor | Detailed tracking | $5.90/user/mo |
| Factorial | HR suite integrated | $4-8/user/mo |

**Automated Attendance Rules**
- Auto-flag late arrivals (>15 min)
- Track break compliance
- Overtime calculation
- Leave balance auto-update

### Performance Review Automation

**Quarterly Review Cycle**
```
Week 1: Self-assessment forms sent
Week 2: Manager reviews + peer feedback
Week 3: Calibration meetings
Week 4: 1:1 discussions + goal setting
```

**360-Degree Feedback Tools**
- **Lattice** - Comprehensive performance management
- **Culture Amp** - Engagement + performance
- **15Five** - Weekly check-ins + reviews
- **Google Forms** - Free, customizable

### Leave Management Automation

**Leave Types by Country**
| Country | Annual Leave | Sick Leave | Public Holidays |
|---------|--------------|------------|-----------------|
| Thailand | 6 days (1st yr), 12+ after | 30 days | 16 days |
| Vietnam | 12 days | 30 days | 11 days |
| Indonesia | 12 days | Unlimited (certified) | 16 days |
| Philippines | 5 days | 15 days | 18 days |

**Automation Rules**
- Auto-approve if: sufficient balance + no conflicts
- Manager approval if: >3 consecutive days
- HR approval if: >7 days or special circumstances

---

## Key Takeaways & Action Items

### Immediate Priorities
1. **Establish overlap hours**: 10:00-14:00 ICT for all-hands meetings
2. **Implement KPI dashboard**: Focus on CPA, LTV, ROAS metrics
3. **Set up payroll automation**: Use Deel/Remote for multi-country team
4. **Create tiered commission structure**: Align with SEA market rates

### Medium-Term Initiatives
1. **Build recruitment pipeline**: Focus on Telegram groups + LinkedIn
2. **Deploy productivity stack**: Slack + Linear + Notion
3. **Automate performance reviews**: Quarterly cycle with 360 feedback
4. **Cultural training**: Brief managers on SEA work cultures

### Long-Term Strategy
1. **Localized HR policies**: Adapt to each country's labor laws
2. **Career progression frameworks**: Clear paths for each role
3. **Employee engagement programs**: Retention in competitive market
4. **Compliance infrastructure**: Legal protection for grey market ops

---

*Document maintained by Sync (CHRO) - Last updated: 2026-02-27*
